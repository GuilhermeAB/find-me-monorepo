<template>
  <v-card class='mb-1'>
    <v-card-item class='pb-0'>
      <v-card-title class='text-caption'>
        {{ item.account.person.name }}

        <span class='text-caption' style='color: grey'>
          {{ getTimeLabel(item.createdAt) }}
        </span>
      </v-card-title>
    </v-card-item>

    <v-card-text class='text-caption'>
      {{ item.content }}
    </v-card-text>

    <v-card-text class='pb-2 pt-0 pl-1'>
      <v-chip
        v-if='item.replies && item.replies.length'
        variant='text'
        density='comfortable'
        color='primary'
        class='text-caption'
        :prepend-icon='repliesIsVisible ? "mdi-arrow-up" : "mdi-arrow-down"'
        @click='repliesIsVisible = !repliesIsVisible'
      >
        {{ $t(repliesIsVisible ? 'HideReplies' : 'ViewReplies', { value: item.replies.length }) }}
      </v-chip>

      <v-chip
        variant='text'
        density='comfortable'
        color='primary'
        class='text-caption'
        prepend-icon='mdi-reply'
        @click='replyCommentIsVisible = !replyCommentIsVisible'
      >
        {{ $t('Reply') }}
      </v-chip>
    </v-card-text>
  </v-card>

  <v-expand-transition>
    <v-row v-if='replyCommentIsVisible' no-gutters>
      <v-col cols='1' />

      <v-col>
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
                variant='outlined'
                density='comfortable'
                color='primary'
                class='mt-2'
                @click='replyCommentIsVisible = false'
              >
                {{ $t('Cancel') }}
              </v-btn>

              <v-btn
                v-if='comment'
                density='comfortable'
                color='primary'
                class='mt-2 ml-2'
                :loading='sendCommentLoading'
                @click='sendComment'
              >
                {{ $t('Send') }}
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>

  <v-expand-transition>
    <v-row v-if='repliesIsVisible && item.replies && item.replies.length' no-gutters>
      <v-col cols='1' />

      <v-col>
        <!-- <div v-for='reply in item.replies' :key='reply.id'>
          <AlertCommentItem :item='reply' />
        </div> -->
        <v-card v-for='reply in item.replies' :key='reply.id' class='mb-1'>
          <v-card-item class='pb-0'>
            <v-card-title class='text-caption'>
              {{ reply.account.person.name }}

              <span class='text-caption' style='color: grey'>
                {{ getTimeLabel(reply.createdAt) }}
              </span>
            </v-card-title>
          </v-card-item>

          <v-card-text class='text-caption'>
            {{ reply.content }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script setup lang='ts'>
  import { useLocale } from 'vuetify';
  import { formatDistanceStrict } from 'date-fns';
  import ptBR from 'date-fns/locale/pt-BR';
  import enUS from 'date-fns/locale/en-US';
  import { ref } from 'vue';
  import { CommentService, CommentType } from '@/services/comment';

  const props = defineProps<{
    item: CommentType,
  }>();

  const { current } = useLocale();

  const repliesIsVisible = ref(false);
  const replyCommentIsVisible = ref(false);

  const comment = ref();
  const sendCommentLoading = ref(false);

  function getTimeLabel (date: string | Date): string {
    const value = formatDistanceStrict(
      new Date(date),
      new Date(),
      {
        locale: current.value === 'en' ? enUS : ptBR,
      },
    );

    return value;
  }

  async function sendComment (): Promise<void> {
    try {
      sendCommentLoading.value = true;
      const result = await CommentService.createReply(props.item.id, comment.value);
      if (result) {
        // eslint-disable-next-line vue/no-mutating-props
        props.item.replies.push(result);

        comment.value = undefined;
        replyCommentIsVisible.value = false;
      }
    } finally {
      sendCommentLoading.value = false;
    }
  }
</script>
