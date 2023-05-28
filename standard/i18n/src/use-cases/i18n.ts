import { en } from '../lang/en';

type ParamsType = Record<string, string | number | boolean>;
interface MessageType {
  code: string,
  message: string,
  params?: ParamsType
}

enum Lang {
  English = 'english',
}

interface I18nProps {
  locale: Lang,
  localeFile: Record<string, string>,
}

export class I18nHandler {
  private props: I18nProps;

  constructor(localeFile?: Record<string, string>) {
    this.props = {
      locale: Lang.English,
      localeFile: localeFile || en,
    };
  }

  /**
 * Get the i18n message object
 *
 * @param {string} key - i18n object key
 * @param {ParamsType} params - (Optional) parameters object
 * @returns a MessageType object with {code: string, message: string, params: ParamsType}
 */
  public getMessage(key: string, params?: ParamsType): MessageType {
    let message = this.props.localeFile[key];

    if (!message) {
      throw new Error(`I18n message ${key} not found`);
    }

    if (params) {
      Object.keys(params).forEach((param: string) => {
        message = message.replace(`{${param}}`, params[param].toString());
      });
    }

    return {
      code: key,
      message,
      params,
    };
  }
}
