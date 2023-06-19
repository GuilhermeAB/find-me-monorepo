<template>
  <v-container fluid fill-height style='height: 100%;'>
    <v-row class='align-center justify-center mt-5'>
      <v-col
        cols='12'
        sm='12'
        md='8'
        lg='8'
        xl='8'
        xxl='8'
      >
        <v-row justify='center' align='center'>
          <v-card flat width='100%'>
            <v-row style='width: 100%' class='pa-3'>
              <v-col
                cols='12'
                sm='12'
                md='6'
                lg='4'
                xl='4'
                xxl='4'
              >
                <v-row no-gutters justify='center' align='center' class='fill-height'>
                  <v-icon size='large' color='primary'>
                    mdi-crosshairs
                  </v-icon>

                  <span class='text-h5 font-weight-bold ml-2'>
                    <span class='text-primary'>F</span>ind me project
                  </span>
                </v-row>
              </v-col>

              <v-col
                cols='12'
                sm='12'
                md='6'
                lg='8'
                xl='8'
                xxl='8'
              >
                <v-row no-gutters justify='center' align='center' class='fill-height'>
                  {{ $t('AboutDescription') }}
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-row>

        <v-row justify='end' align='center' class='mt-5'>
          <v-btn
            variant='outlined'
            color='primary'
            target='_blank'
            href='https://www.linkedin.com/in/guilherme-afonso-borchardt/'
          >
            <v-icon>
              mdi-linkedin
            </v-icon>

            Linkedin
          </v-btn>

          <v-btn
            class='ml-2'
            variant='outlined'
            color='primary'
            target='_blank'
            href='https://github.com/GuilhermeAB/find-me-monorepo'
          >
            <v-icon>
              mdi-github
            </v-icon>

            Github
          </v-btn>
        </v-row>

        <v-row align='center'>
          <v-card-title>
            {{ $t('FrontEnd') }}
          </v-card-title>
        </v-row>

        <v-row align='center'>
          <v-list width='100%'>
            <v-list-item
              v-for='(item, i) in web'
              :key='i'
              :title='$t(item.title)'
              :subtitle='$t(item.subtitle)'
            >
              <template #prepend>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row align='center' class='mt-5'>
          <v-card-title>
            {{ $t('BackEnd') }}
          </v-card-title>
        </v-row>

        <v-row align='center'>
          <v-list width='100%'>
            <v-list-item
              v-for='(item, i) in back'
              :key='i'
              :title='$t(item.title)'
              :subtitle='$t(item.subtitle)'
            >
              <template #prepend>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row align='center' class='mt-5'>
          <v-card-title>
            {{ $t('Database') }}
          </v-card-title>
        </v-row>

        <v-row align='center'>
          <v-list width='100%'>
            <v-list-item
              v-for='(item, i) in database'
              :key='i'
              :title='$t(item.title)'
              :subtitle='$t(item.subtitle)'
            >
              <template #prepend>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row align='center' class='mt-5'>
          <v-card-title>
            {{ $t('Cloud') }}
          </v-card-title>
        </v-row>

        <v-row align='center'>
          <v-list width='100%'>
            <v-list-item
              v-for='(item, i) in cloud'
              :key='i'
              :title='$t(item.title)'
              :subtitle='$t(item.subtitle)'
            >
              <template #prepend>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-row>

        <v-row align='center' class='mt-5'>
          <v-card-title>
            {{ $t('Others') }}
          </v-card-title>
        </v-row>

        <v-row align='center'>
          <v-list width='100%'>
            <v-list-item
              v-for='(item, i) in others'
              :key='i'
              :title='$t(item.title)'
              :subtitle='$t(item.subtitle)'
            >
              <template #prepend>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang='ts'>
  import {
    inject,
  } from 'vue';
  import { Composer } from 'vue-i18n';

  const $i18n = inject<Composer>('$i18n');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $t = $i18n!.t;

  const web = [
    {
      title: 'Vue',
      subtitle: 'VueSubtitle',
      icon: 'mdi-vuejs',
    },
    {
      title: 'Vuetify',
      subtitle: 'VuetifySubtitle',
      icon: 'mdi-vuetify',
    },
    {
      title: 'Typescript',
      subtitle: 'TypescriptSubtitle',
      icon: 'mdi-language-typescript',
    },
    {
      title: 'LeafLet',
      subtitle: 'LeafLetSubtitle',
      icon: 'mdi-map',
    },
    {
      title: 'Pinia',
      subtitle: 'PiniaSubtitle',
      icon: 'mdi-database',
    },
    {
      title: 'Vite',
      subtitle: 'ViteSubtitle',
      icon: 'mdi-language-javascript',
    },
  ];

  const back = [
    {
      title: 'NodeJs',
      subtitle: 'NodeJsSubtitle',
      icon: 'mdi-nodejs',
    },
    {
      title: 'Typescript',
      subtitle: 'TypescriptSubtitle',
      icon: 'mdi-language-typescript',
    },
    {
      title: 'Fastify',
      subtitle: 'FastifySubtitle',
      icon: 'mdi-api',
    },
    {
      title: 'Jest',
      subtitle: 'JestSubtitle',
      icon: 'mdi-test-tube',
    },
    {
      title: 'DateFNS',
      subtitle: 'DateFNSSubtitle',
      icon: 'mdi-calendar',
    },
    {
      title: 'Sharp',
      subtitle: 'SharpSubtitle',
      icon: 'mdi-image',
    },
  ];

  const database = [
    {
      title: 'MongoDB',
      subtitle: 'MongoDBSubtitle',
      icon: 'mdi-database',
    },
    {
      title: 'Redis',
      subtitle: 'RedisSubtitle',
      icon: 'mdi-database',
    },
  ];

  const cloud = [
    {
      title: 'AWS',
      subtitle: 'AWSSubtitle',
      icon: 'mdi-aws',
    },
    {
      title: 'AWSECR',
      subtitle: 'AWSECRSubtitle',
      icon: 'mdi-aws',
    },
    {
      title: 'AWSECS',
      subtitle: 'AWSECSSubtitle',
      icon: 'mdi-aws',
    },
    {
      title: 'AWSS3',
      subtitle: 'AWSS3Subtitle',
      icon: 'mdi-aws',
    },
    {
      title: 'AWSSES',
      subtitle: 'AWSSESSubtitle',
      icon: 'mdi-aws',
    },
    {
      title: 'AWSAmplify',
      subtitle: 'AWSAmplifySubtitle',
      icon: 'mdi-aws',
    },
  ];

  const others = [
    {
      title: 'Docker',
      subtitle: 'DockerSubtitle',
      icon: 'mdi-docker',
    },
    {
      title: 'Yarn',
      subtitle: 'YarnSubtitle',
      icon: 'mdi-npm',
    },
  ];
</script>
