<template>
  <v-card-item class='pa-0'>
    <v-card-title>
      <v-row no-gutters align='center'>
        {{ $t('Comments') }}
      </v-row>
    </v-card-title>

    <v-divider class='mb-3' />
  </v-card-item>

  <v-card variant='flat' class='mb-2'>
    <v-card-text class='pb-3'>
      <v-textarea
        v-model='comment'
        :label='$t("WriteComment")'
        variant='outlined'
        density='comfortable'
        max-rows='2'
        rows='2'
        no-resize
        hide-details
      />

      <v-row no-gutters justify='end'>
        <v-btn
          v-if='comment'
          density='comfortable'
          color='primary'
          class='mt-2'
          :loading='sendCommentLoading'
          @click='sendComment'
        >
          {{ $t('Send') }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>

  <div v-if='list'>
    <div v-for='item in list' :key='item.id'>
      <AlertCommentItem :item='item' />
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { onMounted, ref, inject } from 'vue';
  import { Composer } from 'vue-i18n';
  import { CommentType, CommentService } from '@/services/comment';
  import AlertCommentItem from './AlertCommentItem.vue';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });

  const list = ref<CommentType[]>();
  onMounted(async () => {
    list.value = await CommentService.list(props.id);
  });

  const comment = ref();
  const sendCommentLoading = ref(false);
  async function sendComment (): Promise<void> {
    try {
      sendCommentLoading.value = true;
      const result = await CommentService.create(props.id, comment.value);
      if (result) {
        if (!list.value) {
          list.value = [];
        }

        list.value.push(result);

        comment.value = undefined;
      }
    } finally {
      sendCommentLoading.value = false;
    }
  }
</script>
