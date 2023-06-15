import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      // BACK
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
    },
    pt: {
      // BACK
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
    },
    // Other locales and translations
  },
});
