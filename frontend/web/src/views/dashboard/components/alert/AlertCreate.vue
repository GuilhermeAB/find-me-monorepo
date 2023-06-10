<template>
  <v-row no-gutters justify='center'>
    <v-btn-toggle
      v-model='type'
      mandatory
      color='primary'
      class='ml-2'
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
          variant='outlined'
          :label='$t("BirthDate")'
          :rules='[rules.required]'
          class='mt-1'
        />
        <v-text-field
          v-model='disappearDate'
          variant='outlined'
          :label='$t("DisappearDate")'
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
          prepend-icon
          prepend-inner-icon='mdi-camera'
          class='mt-1'
          :label='$t("Image")'
          :rules='[rules.required]'
        />
      </v-form>
    </v-sheet>

    <v-sheet width='90%' height='300'>
      <l-map
        v-model='zoom'
        v-model:zoom='zoom'
        :min-zoom='10'
        :use-global-leaflet='false'
        :center='mapCenter'
      >
        <l-tile-layer
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
    ref, inject,
  } from 'vue';
  import { Composer } from 'vue-i18n';
  import {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  } from '@vue-leaflet/vue-leaflet';
  import L from 'leaflet';
  import { AlertType, PetType, AlertService } from '@/services';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const emit = defineEmits(['close']);
  const loading = ref(false);

  const zoom = ref(12);
  const mapCenter = ref<L.PointExpression>([-25.383585, -49.242825]);
  const markerLatLng = ref<L.LatLngExpression>([-25.383585, -49.242825]);

  const onMarkerDragEnd = (event: L.DragEndEvent): void => {
    const { lat, lng } = event.target.getLatLng();
    markerLatLng.value = [lat, lng];
  };

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

  const rules = {
    required: (value: unknown): boolean | string => !!value || $t('ValueRequired'),
    descriptionLength: (value: string): boolean | string => value.length <= 400 || $t('DescriptionLength', { min: 20, max: 400 }),
  };

  async function save (): Promise<void> {
    const { valid } = await form.value.validate();

    if (valid) {
      try {
        loading.value = true;

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

        emit('close');
      } finally {
        loading.value = false;
      }
    }
  }
</script>
