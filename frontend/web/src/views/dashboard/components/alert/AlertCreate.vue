<template>
  <v-row no-gutters justify='center'>
    <v-btn-toggle
      v-model='type'
      mandatory
      color='primary'
      class='ml-2'
      :disabled='editMode'
    >
      <v-btn stacked width='150' :value='AlertType.Person'>
        <v-icon size='small' class='mb-1'>
          mdi-account
        </v-icon>

        <span>
          {{ $t('Person') }}
        </span>
      </v-btn>

      <v-btn stacked width='150' :value='AlertType.Pet'>
        <v-icon size='small' class='mb-1'>
          mdi-paw
        </v-icon>

        <span>
          {{ $t('Pet') }}
        </span>
      </v-btn>
    </v-btn-toggle>
  </v-row>

  <v-row no-gutters justify='center' class='mt-5'>
    <v-sheet width='90%'>
      <v-form ref='form' validate-on='blur'>
        <v-text-field
          v-model='name'
          variant='outlined'
          :label='$t("Name")'
          :rules='[rules.required]'
        />
        <v-text-field
          v-model='birthDate'
          v-maska:[dateMask]
          variant='outlined'
          :label='$t("BirthDate")'
          placeholder='dd/MM/yyyy'
          :rules='[rules.required]'
          class='mt-1'
        />
        <v-text-field
          v-model='disappearDate'
          v-maska:[dateTimeMask]
          variant='outlined'
          :label='$t("DisappearDate")'
          placeholder='dd/MM/yyyy hh:mm'
          :rules='[rules.required]'
          class='mt-1'
        />

        <v-checkbox
          v-if='type === AlertType.Person'
          v-model='pcd'
          :label='$t("PcDLabel")'
        />

        <v-select
          v-if='type === AlertType.Pet'
          v-model='petType'
          variant='outlined'
          :label='$t("PetType")'
          :items='petTypeList'
          :rules='[rules.required]'
          class='mt-1'
        />

        <v-textarea
          v-model='description'
          counter
          variant='outlined'
          :label='$t("Description")'
          :rules='[rules.required, rules.descriptionLength]'
          class='mt-1'
        />

        <v-file-input
          v-model='image'
          variant='outlined'
          show-size
          accept='image/png, image/jpeg'
          prepend-icon=''
          prepend-inner-icon='mdi-camera'
          class='mt-1'
          :label='$t("Image")'
          :rules='!editMode ? [rules.required] : []'
        />
      </v-form>
    </v-sheet>

    <v-sheet width='90%'>
      <span>
        <v-icon size='x-small'>
          mdi-map
        </v-icon>

        {{ $t('LastSeenAt') }}
      </span>
    </v-sheet>

    <v-sheet width='90%' height='300' class='mt-2'>
      <l-map
        v-model='zoom'
        v-model:zoom='zoom'
        :min-zoom='10'
        :use-global-leaflet='false'
        :center='mapCenter'
      >
        <l-tile-layer
          v-if='global.current.value.dark'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          layer-type='base'
          name='OpenStreetMap'
          class-name='map-tiles'
        />

        <l-tile-layer
          v-else
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          layer-type='base'
          name='OpenStreetMap'
        />

        <l-marker
          draggable
          :lat-lng='markerLatLng'
          @dragend='onMarkerDragEnd'
        >
          <l-icon class-name='map-icon-custom-class'>
            <v-icon
              size='36'
              color='error'
              class='pr-3 pb-3'
            >
              mdi-map-marker
            </v-icon>
          </l-icon>
        </l-marker>
      </l-map>
    </v-sheet>

    <v-btn
      width='90%'
      color='primary'
      variant='flat'
      class='mt-5'
      :loading='loading'
      @click='save'
    >
      {{ $t('Save') }}
    </v-btn>
  </v-row>
</template>

<script setup lang='ts'>
  import {
    ref, inject, onMounted,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  } from '@vue-leaflet/vue-leaflet';
  import L from 'leaflet';
  import { vMaska } from 'maska';
  import { useTheme } from 'vuetify';
  import {
    AlertType, PetType, AlertService, Alert,
  } from '@/services';

  const props = defineProps<{ alert?: Alert }>();

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const emit = defineEmits(['close', 'updated']);

  const { global } = useTheme();

  const loading = ref(false);
  const editMode = ref(!!props.alert);

  const rules = {
    required: (value: unknown): boolean | string => !!value || $t('ValueRequired'),
    descriptionLength: (value: string): boolean | string => value.length <= 400 || $t('DescriptionLength', { min: 20, max: 400 }),
  };

  const zoom = ref(12);
  const mapCenter = ref<L.PointExpression>([-25.383585, -49.242825]);
  const markerLatLng = ref<L.LatLngExpression>([-25.383585, -49.242825]);

  const onMarkerDragEnd = (event: L.DragEndEvent): void => {
    const { lat, lng } = event.target.getLatLng();
    markerLatLng.value = [lat, lng];
  };

  const dateMask = { mask: '##/##/####' };
  const dateTimeMask = { mask: '##/##/#### ##:##' };
  const type = ref(AlertType.Person);
  const petTypeList = Object.values(PetType).map((i) => $t(i));

  const form = ref();
  const name = ref();
  const description = ref();
  const birthDate = ref();
  const disappearDate = ref();
  const pcd = ref();
  const petType = ref();
  const image = ref();

  onMounted(() => {
    if (editMode.value && props.alert) {
      const birthDateProp = props.alert.birthDate.toString().substring(0, 10);
      const [birthYear, birthMonth, birthDay] = birthDateProp.split('-');
      const disappearDateProp = props.alert.disappearDate.toString().substring(0, 10);
      const [disappearYear, disappearMonth, disappearDay] = disappearDateProp.split('-');

      type.value = props.alert.type;
      petType.value = props.alert.info.petType;
      name.value = props.alert.name;
      description.value = props.alert.description;
      birthDate.value = `${birthDay}/${birthMonth}/${birthYear}`;
      disappearDate.value = `${disappearDay}/${disappearMonth}/${disappearYear} ${props.alert.disappearDate.toString().substring(11, 16)}`;
      pcd.value = props.alert.info.isPCD;
      mapCenter.value = [props.alert.location.coordinates[1], props.alert.location.coordinates[0]];
      markerLatLng.value = [props.alert.location.coordinates[1], props.alert.location.coordinates[0]];
    }
  });

  async function save (): Promise<void> {
    const { valid } = await form.value.validate();

    if (valid) {
      try {
        loading.value = true;

        if (editMode.value && props.alert) {
          await AlertService.update(
            props.alert.id,
            {
              type: type.value,
              name: name.value,
              description: description.value,
              birthDate: birthDate.value,
              disappearDate: disappearDate.value,
              isPCD: pcd.value,
              petType: petType.value,
              latitude: (markerLatLng.value as number[])[0],
              longitude: (markerLatLng.value as number[])[1],
            },
            image.value ? image.value[0] : undefined,
          );

          emit('updated');
        } else {
          await AlertService.create(
            {
              type: type.value,
              name: name.value,
              description: description.value,
              birthDate: birthDate.value,
              disappearDate: disappearDate.value,
              isPCD: pcd.value,
              petType: petType.value,
              latitude: (markerLatLng.value as number[])[0],
              longitude: (markerLatLng.value as number[])[1],
            },
            image.value ? image.value[0] : undefined,
          );
        }

        emit('close');
      } finally {
        loading.value = false;
      }
    }
  }
</script>
