<template>
  <v-card-item class='pa-0'>
    <v-card-title>
      <v-row no-gutters align='center'>
        <span>
          <v-icon size='x-small'>
            mdi-forum
          </v-icon>
          {{ $t('Comments') }}

          <span v-if='count' class='text-body-2'>
            ({{ count.comments + count.replies }})
          </span>
        </span>
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

  <div v-if='list && list.length'>
    <div v-for='item in list' :key='item.id'>
      <AlertCommentItem :item='item' :owner-id='ownerId' @replied='replied' />
    </div>
  </div>

  <v-sheet
    v-else
    class='d-flex align-center justify-center flex-wrap text-center mx-auto'
    rounded
    width='100%'
    min-width='100'
    min-height='100'
  >
    <div>
      <p class='text-body-2'>
        <v-icon class='mr-3'>
          mdi-message-alert-outline
        </v-icon>

        {{ $t('NoCommentsFound') }}
      </p>
    </div>
  </v-sheet>
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
    ownerId: {
      type: String,
      required: true,
    },
  });

  const list = ref<CommentType[]>();
  const count = ref<{ comments: number, replies: number }>();
  onMounted(async () => {
    const result = await CommentService.list(props.id);
    list.value = result?.list;
    count.value = result?.count;
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

        if (!count.value) {
          count.value = {
            comments: 0,
            replies: 0,
          };
        }

        list.value.push(result);
        count.value.comments += 1;

        comment.value = undefined;
      }
    } finally {
      sendCommentLoading.value = false;
    }
  }

  function replied (): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    count.value!.replies += 1;
  }
</script>
