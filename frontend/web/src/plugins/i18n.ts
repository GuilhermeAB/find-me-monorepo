import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      SignIn: 'Sign in',
      Languages: 'Languages',
      LightTheme: 'Light theme',
      DarkTheme: 'Dark theme',
      MissingFor: 'Missing for {value}',
      PWD: 'PWD',
      PcDLabel: 'Person with Disability',
      Search: 'Search',
      Details: 'Details',
      Alerts: 'Alerts',
      EmptyAlertListLabel: 'No alerts found. Change coordinates or filter and try again',
      NewAlert: 'New alert',
      Dog: 'Dog',
      Cat: 'Cat',
      Bird: 'Bird',
      Person: 'Person',
      Pet: 'Pet',
      Name: 'Name',
      BirthDate: 'Birth date',
      DisappearDate: 'Disappear date',
      PetType: 'Pet type',
      Image: 'Image',
      Save: 'Save',
      ValueRequired: 'Value is required',
      Alert: 'Alert',
      LastSeenAt: 'Last seen at',
      HomePage: 'Home page',
      Home: 'Home',
      Description: 'Description',
      DescriptionLength: 'Max 400 characters',
      NameLength: 'Name must be at least {min} characters and not more than {max} characters',
      Email: 'Email',
      Password: 'Password',
      RememberMe: 'Remember me',
      SignUp: 'Sign up',
      ForgotPassword: 'Forgot my password',
      AlertCreatedBy: 'Alert created by {value}',
      Age: '{value} years',
    },
    pt: {
      SignIn: 'Entrar',
      Languages: 'Linguagens',
      LightTheme: 'Tema claro',
      DarkTheme: 'Tema escuro',
      MissingFor: 'Desaparecido por {value}',
      PcD: 'PcD',
      PcDLabel: 'Pessoa com deficiência',
      Search: 'Pesquisar',
      Details: 'Detalhes',
      Alerts: 'Alertas',
      EmptyAlertListLabel: 'Nenhum alerta encontrado. Altere as coordenadas ou filtros e tente novamente',
      NewAlert: 'Novo alerta',
      Dog: 'Cachorro',
      Cat: 'Gato',
      Bird: 'Pássaro',
      Person: 'Pessoa',
      Pet: 'Pet',
      Name: 'Nome',
      BirthDate: 'Data de nascimento',
      DisappearDate: 'Data de desaparecimento',
      PetType: 'Tipo do pet',
      Image: 'Imagem',
      Save: 'Salvar',
      ValueRequired: 'Valor obrigatório',
      Alert: 'Alerta',
      LastSeenAt: 'Visto por último em',
      HomePage: 'Página inicial',
      Home: 'Início',
      Description: 'Descrição',
      DescriptionLength: 'Máximo de 400 caracteres',
      NameLength: 'Nome deve possuir no mínimo {min} caracteres e não mais que {max} caracteres',
      Email: 'Email',
      Password: 'Senha',
      RememberMe: 'Manter conectado',
      SignUp: 'Registrar',
      ForgotPassword: 'Esqueci minha senha',
      AlertCreatedBy: 'Alerta criado por {value}',
      Age: '{value} anos',
    },
    // Other locales and translations
  },
});
