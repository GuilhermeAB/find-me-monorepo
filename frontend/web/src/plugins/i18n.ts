import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'pt',
  messages: {
    en: {
      // BACK
      InternalServerError: 'Internal server error',
      InvalidEnv: 'Internal error. Invalid environment file',
      IdRequired: 'Identifier is required',
      InvalidId: 'Invalid identifier',
      InvalidDate: 'Invalid date',
      Updated: 'Updated',
      Saved: 'Saved',
      Added: 'Added',
      Removed: 'Removed',
      NotFound: 'NotFound',
      InvalidAlertType: 'Invalid alert type: {type}',
      AlertTypeRequired: 'Alert type required',
      BirthDateRequired: 'Birth date required',
      BirthDateInvalid: 'Birth date invalid',
      BirthDateMinMax: 'You must have at least {min} years to sign up in our platform and not more than {max} years',
      DisappearDateRequired: 'Disappear date required',
      DisappearDateInvalid: 'Disappear date invalid',
      NameRequired: 'Name required',
      NameLength: 'Name must be at least {min} characters and not more than {max} characters',
      NameInvalid: 'Name invalid',
      InvalidPDCValue: 'Invalid PDC value',
      ImageTypeRequired: 'Image type required',
      InvalidImageType: 'Invalid image type: {type}',
      WidthRequired: 'Width required',
      InvalidWidth: 'Invalid height',
      HeightRequired: 'Height required',
      InvalidHeight: 'Invalid height',
      SizeRequired: 'Size required',
      InvalidSize: 'Invalid size',
      MaxFileSize: 'Max file size: {value} MB',
      LatitudeRequired: 'Latitude required',
      LatitudeInvalid: 'Invalid latitude',
      LongitudeRequired: 'Longitude required',
      LongitudeInvalid: 'Invalid longitude',
      AlertNotFound: 'Alert not found',
      ImageNotFound: 'Image not found',
      AlertCreated: 'Alert created',
      AlertUpdated: 'Alert updated',
      DescriptionRequired: 'Description required',
      DescriptionLength: 'Description must be at least {min} characters and not more than {max} characters',
      EmailRequired: 'Email required',
      EmailLength: 'Email must be at least {min} characters and not more than {max} characters',
      EmailInvalid: 'Email invalid',
      PasswordRequired: 'Password required',
      PasswordLength: 'Password must be at least {min} characters and not more than {max} characters',
      PasswordNumberRequired: 'Password must have at least one numerical character',
      PasswordLowerUpperRequired: 'Password must have at least one lowercase and uppercase character',
      PasswordSpecialRequired: 'Password must have at least one special character',
      RoleRequired: 'Role required',
      RoleInvalid: 'Role invalid',
      StatusRequired: 'Status required',
      StatusInvalid: 'Status invalid',
      EmailAlreadyExists: 'Email already registered',
      SignInManyFailedAttempts: 'Many failed sign in attempts. Try again in {value} minute(s)',
      InvalidEmailOrPassword: 'Email or password invalid',
      AccountDisabled: 'Account disabled',
      AuthenticationRequired: 'Authentication required',
      RememberMeInvalid: 'Remember me invalid value',
      CommentNotFound: 'Comment not found',
      ContentRequired: 'Content required',
      ContentLength: 'Content must be at least {min} characters and not more than {max} characters',
      InvalidToken: 'Invalid token',
      AccountNotFound: 'Account not found',
      RepeatPasswordRequired: 'Repeat password required',
      PasswordAndRepeatPasswordInvalid: 'Password and repeat password are not the same',
      InvalidPassword: 'Invalid password',
      CommentReplyCreated: 'Reply created',
      CommentCreated: 'Comment created',
      AccountCreated: 'Account created',
      SignInSuccess: 'Sign in successfully',
      PasswordUpdated: 'Password updated',
      PersonUpdated: 'Person updated',
      SignOutSuccess: 'Sign out successfully',
      CantActivateAccount: 'Cant activate account. Your account is {value}',
      ManyInvalidActivationAttempts: 'Many failed activation attempts. You have to request a new activation code to proceed',
      ActivationCodeExpired: 'The activation code is expired. You have to request a new activation code to proceed',
      ActivationCodeInvalid: 'Activation code is invalid',
      ActivationSuccess: 'Account activated',
      CantRequestNewActivationCode: 'Cant request new activation code. Your account is {value}',
      ActivationCodeRequestManyAttempts: 'Many attempts to request a new activation code. Try again in {value} minute(s)',
      ActivationCodeSent: 'Activation code sent',
      PasswordRecoverRequestManyAttempts: 'Many attempts to request password recover. Try again in {value} minute(s)',
      PasswordRecoverMaxAttempts: 'Many failed attempts to recover password. Request a new recover code and try again',
      PasswordRecoverCodeExpired: 'Password recover code expired. Request a new recover code and try again',
      PasswordRecoverCodeInvalid: 'Password recover code invalid',
      CodeRequired: 'Code is required',
      AccountNotRequestedRecover: 'You must request a recovery code to proceed',
      PasswordChangeSamePasswords: 'The new password must be different from the current one',
      PasswordChangeSuccess: 'Password changed successfully',
      PasswordRecoverSent: 'Password recover code sent',
      AuthenticationInvalidStatus: 'Your account must be {status} to proceed',
      MaxAlertsCreated: 'You have reached the maximum amount of alerts: {value}',
      MaxAlertsOpen: 'You have reached the maximum amount of open alerts: {value}',
      SearchTextInvalid: 'Search text invalid',
      InvalidAlertStatus: 'Invalid alert status: {type}',
      StartDateInvalid: 'Start date invalid',
      EndDateInvalid: 'End date invalid',
      MissingDateStartInvalid: 'Missing start date invalid',
      MissingDateEndInvalid: 'Missing end date invalid',

      // WEB
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
      Email: 'Email',
      Password: 'Password',
      RememberMe: 'Remember me',
      SignUp: 'Sign up',
      ForgotPassword: 'Forgot my password',
      AlertCreatedBy: 'Alert created by {value}',
      Age: '{value} years',
      ViewReplies: 'View {value} replies',
      HideReplies: 'Hide {value} replies',
      WriteComment: 'Leave a comment',
      Comments: 'Comments',
      Send: 'Send',
      Reply: 'Reply',
      Cancel: 'Cancel',
      SignOut: 'Sign out',
      Profile: 'Profile',
      Edit: 'Edit',
      EditProfile: 'Edit profile',
      NoAlertsFound: 'No alerts found',
      MyAlerts: 'My alerts',
      EditData: 'Edit data',
      EditPassword: 'Edit password',
      RepeatPassword: 'Repeat password',
      CurrentPassword: 'Current password',
      NewPassword: 'New password',
      NoCommentsFound: 'No comments found',
      EditAlert: 'Edit alert',
      CloseAlert: 'Close alert',
      AlertResolvedLabel: 'Has this alert been resolved?',
      Yes: 'Yes',
      No: 'No',
      Resolved: 'Resolved',
      Closed: 'Closed',
      Open: 'Open',
      AlertOwner: 'Owner',
      MyComment: 'My comment',
      ActivateAccountBanner: 'Your account is {status}',
      unverified: 'Unverified',
      verified: 'Verified',
      disabled: 'Disabled',
      ActivateAccount: 'Activate account',
      Code: 'Code',
      RequestNewCode: 'Request new code',
      RequestRecoverPassword: 'Request recover password code',
      RecoverPassword: 'Recover password',
      Recover: 'Recover',
      ServicesStatusTitle: 'API services status',
      AuthAPI: 'Authentication service',
      AlertAPI: 'Alert service',
      Online: 'Online',
      Offline: 'Offline',
      CheckAgain: 'Check again',
      PrintPoster: 'Print poster',
      Missing: 'Missing',
      BetaWarningText: 'Website in beta! The data displayed is fictitious',
      About: 'About',
      AboutDescription: 'Find Me is a web application designed to help find missing people and pets. It provides a platform where users can create and search for missing person or pet reports, and collaborate with others to increase the chances of finding them.',
      FrontEnd: 'Front end',
      BackEnd: 'Back end',
      Database: 'Database',
      Others: 'Others',
      Cloud: 'Cloud',
      Vue: 'Vue.js',
      VueSubtitle: '3.x',
      Vuetify: 'Vuetify',
      VuetifySubtitle: '3.x',
      Typescript: 'Typescript',
      TypescriptSubtitle: '5.x',
      LeafLet: 'LeafLet',
      LeafLetSubtitle: 'Maps by LeafLet and open street',
      Pinia: 'Pinia',
      PiniaSubtitle: 'Vue state management',
      Vite: 'Vite',
      ViteSubtitle: '4.x',
      NodeJs: 'Node.js',
      NodeJsSubtitle: '20.x',
      Fastify: 'Fastify',
      FastifySubtitle: '4.x',
      Jest: 'Jest',
      JestSubtitle: '29.x',
      DateFNS: 'Date FNS',
      DateFNSSubtitle: '2.x',
      Sharp: 'Sharp',
      SharpSubtitle: 'Sharp images',
      MongoDB: 'Mongo DB',
      MongoDBSubtitle: 'Mongo DB with mongoose',
      Redis: 'Redis',
      RedisSubtitle: 'Redis cache',
      AWS: 'AWS',
      AWSSubtitle: 'Amazon web services',
      AWSECR: 'AWS ECR',
      AWSECRSubtitle: 'AWS elastic container registry',
      AWSS3: 'AWS S3',
      AWSECS: 'AWS ECS',
      AWSECSSubtitle: 'AWS elastic container service',
      AWSS3Subtitle: 'AWS S3 files',
      AWSSES: 'AWS SES',
      AWSSESSubtitle: 'AWS Simple email service',
      AWSAmplify: 'AWS Amplify',
      AWSAmplifySubtitle: 'AWS Amplify hosting',
      Docker: 'Docker',
      DockerSubtitle: 'Docker',
      Yarn: 'Yarn 3.x',
      YarnSubtitle: 'Yarn plug and play',
      Type: 'Type',
      Status: 'Status',
      BirthDateAge: 'Age',
      LessThanAge: 'Less than {value} years',
      MoreThanAge: 'More than {value} years',
      Custom: 'Custom',
      Filters: 'Filters',
      SearchEmptyAlertList: 'No alerts found. Change the filters and try again',
    },
    pt: {
      // BACK
      InternalServerError: 'Erro interno',
      InvalidEnv: 'Erro interno. Variáveis de ambiente inválidas',
      IdRequired: 'Identificador obrigatório',
      InvalidId: 'Identificador invalido',
      InvalidDate: 'Data inválida',
      Updated: 'Atualizado',
      Saved: 'Salvo',
      Added: 'Adicionado',
      Removed: 'Removido',
      NotFound: 'Não encontrado',
      InvalidAlertType: 'Tipo do alerta invalido: {type}',
      AlertTypeRequired: 'Tipo do alerta obrigatório',
      BirthDateRequired: 'Data de nascimento obrigatório',
      BirthDateInvalid: 'Data de nascimento inválida',
      BirthDateMinMax: 'Você deve possuir no mínimo {min} anos para se registrar em nossa plataforma e não mais que {max} anos',
      DisappearDateRequired: 'Data de desaparecimento obrigatória',
      DisappearDateInvalid: 'Data de desaparecimento inválida',
      NameRequired: 'Nome obrigatório',
      NameLength: 'Nome deve possuir no mínimo {min} caracteres e no máximo {max} caracteres',
      NameInvalid: 'Nome invalido',
      InvalidPDCValue: 'PCD invalido',
      ImageTypeRequired: 'Tipo de imagem obrigatório',
      InvalidImageType: 'Tipo da imagem invalido: {type}',
      WidthRequired: 'Largura obrigatório',
      InvalidWidth: 'Largura invalida',
      HeightRequired: 'Altura obrigatório',
      InvalidHeight: 'Altura invalida',
      SizeRequired: 'Tamanho obrigatório',
      InvalidSize: 'Tamanho invalido',
      MaxFileSize: 'Tamanho máximo do arquivo: {value} MB',
      LatitudeRequired: 'Latitude obrigatória',
      LatitudeInvalid: 'Latitude invalida',
      LongitudeRequired: 'Longitude obrigatória',
      LongitudeInvalid: 'Longitude invalida',
      AlertNotFound: 'Alerta não encontrado',
      ImageNotFound: 'Imagem não encontrada',
      AlertCreated: 'Alerta criado',
      AlertUpdated: 'Alerta atualizado',
      DescriptionRequired: 'Descrição obrigatória',
      DescriptionLength: 'Descrição deve possuir no mínimo {min} caracteres e não mais que {max} caracteres',
      EmailRequired: 'Email obrigatório',
      EmailLength: 'Email deve possuir no mínimo {min} caracteres e não mais que {max} caracteres',
      EmailInvalid: 'Email invalido',
      PasswordRequired: 'Senha obrigatória',
      PasswordLength: 'Senha deve possuir no mínimo {min} caracteres e não mais que {max} caracteres',
      PasswordNumberRequired: 'Senha deve possuir no mínimo um número',
      PasswordLowerUpperRequired: 'Senha deve possuir no mínimo um caractere minusculo e maiúsculo',
      PasswordSpecialRequired: 'Senha deve possuir no mínimo um caractere especial',
      RoleRequired: 'Cargo obrigatório',
      RoleInvalid: 'Cargo invalido',
      StatusRequired: 'Status obrigatório',
      StatusInvalid: 'Status invalido',
      EmailAlreadyExists: 'Email já registrado',
      SignInManyFailedAttempts: 'Muitas tentativas de acesso invalidas. Tente novamente em {value} minuto(s)',
      InvalidEmailOrPassword: 'Email ou senha inválidos',
      AccountDisabled: 'Conta desabilitada',
      AuthenticationRequired: 'Autenticação obrigatória',
      RememberMeInvalid: 'Valor de "manter conectado" invalido',
      CommentNotFound: 'Comentário não encontrado',
      ContentRequired: 'Conteúdo obrigatório',
      ContentLength: 'Conteúdo deve possuir no mínimo {min} caracteres e não mais que {max} caracteres',
      InvalidToken: 'Token invalido',
      AccountNotFound: 'Conta não encontrada',
      RepeatPasswordRequired: 'Necessário confirmar a senha informada',
      PasswordAndRepeatPasswordInvalid: 'Senhas informadas não coincidem',
      InvalidPassword: 'Senha invalida',
      CommentReplyCreated: 'Resposta criada',
      CommentCreated: 'Comentário criado',
      AccountCreated: 'Conta criada',
      SignInSuccess: 'Conectado',
      PasswordUpdated: 'Senha atualizada',
      PersonUpdated: 'Pessoa atualizada',
      SignOutSuccess: 'Desconectado',
      CantActivateAccount: 'Não é possível ativar sua conta. O status da sua conta é {value}',
      ManyInvalidActivationAttempts: 'Muitas tentativas invalidas de ativação de conta. Você deve solicitar um novo código de ativação para continuar',
      ActivationCodeExpired: 'Código de ativação expirado. Você deve solicitar um novo código para continuar',
      ActivationCodeInvalid: 'Código de ativação inválido',
      ActivationSuccess: 'Conta ativada',
      CantRequestNewActivationCode: 'Não foi possível solicitar um código de ativação. Sua conta esta {value}',
      ActivationCodeRequestManyAttempts: 'Muitas solicitações de códigos de ativação. Tente novamente em {value} minuto(s)',
      ActivationCodeSent: 'Código de ativação enviado',
      PasswordRecoverRequestManyAttempts: 'Muitas solicitações de códigos de recuperação de senha. Tente novamente em {value} minuto(s)',
      PasswordRecoverMaxAttempts: 'Muitas tentativas de recuperação de senha. Solicite um novo código de recuperação e tente novamente',
      PasswordRecoverCodeExpired: 'Código de recuperação de senha expirado. Solicite um novo código de recuperação e tente novamente',
      PasswordRecoverCodeInvalid: 'Código de recuperação de senha inválido',
      CodeRequired: 'Código obrigatório',
      AccountNotRequestedRecover: 'Você deve solicitar um código de recuperação para continuar',
      PasswordChangeSamePasswords: 'Sua nova senha deve ser diferente da senha atual',
      PasswordChangeSuccess: 'Senha alterada com sucesso',
      PasswordRecoverSent: 'Código de recuperação de senha enviado',
      MaxAlertsCreated: 'Você atingiu a quantidade máxima de alertas: {value}',
      MaxAlertsOpen: 'Você atingiu a quantidade máxima de alertas abertos: {value}',
      SearchTextInvalid: 'Texto de pesquisa invalido',
      InvalidAlertStatus: 'Estado do alerta invalido: {type}',
      StartDateInvalid: 'Data de início invalida',
      EndDateInvalid: 'Data de termino invalida',
      MissingDateStartInvalid: 'Data de desaparecimento inicial invalida',
      MissingDateEndInvalid: 'Data de desaparecimento final invalida',

      // WEB
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
      Email: 'Email',
      Password: 'Senha',
      RememberMe: 'Manter conectado',
      SignUp: 'Registrar',
      ForgotPassword: 'Esqueci minha senha',
      AlertCreatedBy: 'Alerta criado por {value}',
      Age: '{value} anos',
      ViewReplies: 'Exibir {value} respostas',
      HideReplies: 'Esconder {value} respostas',
      WriteComment: 'Escreva um comentário',
      Comments: 'Comentários',
      Send: 'Enviar',
      Reply: 'Responder',
      Cancel: 'Cancelar',
      SignOut: 'Desconectar',
      Profile: 'Perfil',
      Edit: 'Editar',
      EditProfile: 'Editar perfil',
      NoAlertsFound: 'Nenhum alerta encontrado',
      MyAlerts: 'Meus alertas',
      EditData: 'Editar dados',
      EditPassword: 'Editar senha',
      RepeatPassword: 'Repita a senha',
      CurrentPassword: 'Senha atual',
      NewPassword: 'Nova senha',
      NoCommentsFound: 'Nenhum comentário encontrado',
      EditAlert: 'Editar alerta',
      CloseAlert: 'Fechar alerta',
      AlertResolvedLabel: 'Este alerta foi resolvido?',
      Yes: 'Sim',
      No: 'Não',
      Resolved: 'Resolvido',
      Closed: 'Fechado',
      Open: 'Aberto',
      AlertOwner: 'Criador',
      MyComment: 'Meu comentário',
      ActivateAccountBanner: 'Sua conta esta {status}',
      unverified: 'Não verificada',
      verified: 'Verificada',
      disabled: 'Desabilitada',
      ActivateAccount: 'Ativar conta',
      Code: 'Código',
      RequestNewCode: 'Solicitar novo código',
      RequestRecoverPassword: 'Solicitar código de recuperação',
      RecoverPassword: 'Recuperar senha',
      Recover: 'Recuperar',
      AuthenticationInvalidStatus: 'Sua conta deve ser {status} para continuar',
      ServicesStatusTitle: 'Status dos serviços',
      AuthAPI: 'Serviço de autenticação',
      AlertAPI: 'Serviço de alertas',
      Online: 'Disponível',
      Offline: 'Desconectado',
      CheckAgain: 'Verificar novamente',
      PrintPoster: 'Imprimir cartaz',
      Missing: 'Desaparecido',
      BetaWarningText: 'Plataforma em testes. Dados exibidos são fictícios',
      About: 'Sobre',
      AboutDescription: 'Find Me é uma aplicação projetada para ajudar a encontrar pessoas e animais de estimação desaparecidos. Ele fornece uma plataforma onde os usuários podem criar e pesquisar alertas de pessoas desaparecidas ou animais de estimação e colaborar com outras pessoas para aumentar as chances de encontrá-los.',
      FrontEnd: 'Front end',
      BackEnd: 'Back end',
      Database: 'Base de dados',
      Others: 'Outros',
      Cloud: 'Nuvem',
      Vue: 'Vue.js',
      VueSubtitle: '3.x',
      Vuetify: 'Vuetify',
      VuetifySubtitle: '3.x',
      Typescript: 'Typescript',
      TypescriptSubtitle: '5.x',
      LeafLet: 'LeafLet',
      LeafLetSubtitle: 'Mapas por LeafLet e open street',
      Pinia: 'Pinia',
      PiniaSubtitle: 'Vue gerenciador de estados',
      Vite: 'Vite',
      ViteSubtitle: '4.x',
      NodeJs: 'Node.js',
      NodeJsSubtitle: '20.x',
      Fastify: 'Fastify',
      FastifySubtitle: '4.x',
      Jest: 'Jest',
      JestSubtitle: '29.x',
      DateFNS: 'Date FNS',
      DateFNSSubtitle: '2.x',
      Sharp: 'Sharp',
      SharpSubtitle: 'Sharp imagens',
      MongoDB: 'Mongo DB',
      MongoDBSubtitle: 'Mongo DB com mongoose',
      Redis: 'Redis',
      RedisSubtitle: 'Redis cache',
      AWS: 'AWS',
      AWSSubtitle: 'Amazon web services',
      AWSECR: 'AWS ECR',
      AWSECRSubtitle: 'AWS elastic container registry',
      AWSS3: 'AWS S3',
      AWSECS: 'AWS ECS',
      AWSECSSubtitle: 'AWS elastic container service',
      AWSS3Subtitle: 'AWS S3 files',
      AWSSES: 'AWS SES',
      AWSSESSubtitle: 'AWS Simple email service',
      AWSAmplify: 'AWS Amplify',
      AWSAmplifySubtitle: 'AWS Amplify hosting',
      Docker: 'Docker',
      DockerSubtitle: 'Docker',
      Yarn: 'Yarn 3.x',
      YarnSubtitle: 'Yarn plug and play',
      Type: 'Tipo',
      Status: 'Estado',
      BirthDateAge: 'Idade',
      LessThanAge: 'Menor que {value} anos',
      MoreThanAge: 'Maior que {value} anos',
      Custom: 'Customizado',
      Filters: 'Filtros',
      SearchEmptyAlertList: 'Nenhum alerta encontrado. Altere os filtros e tente novamente',
    },
    // Other locales and translations
  },
});
