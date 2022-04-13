import variables from 'modules/variables';
import { PureComponent } from 'react';

import Radio from '../Radio';

import languages from 'modules/languages.json';

export default class LanguageSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      quoteLanguages: [
        {
          name: this.getMessage('modals.main.loading'),
          value: 'loading',
        },
      ],
    };
    this.controller = new AbortController();
  }

  async getQuoteLanguages() {
    const data = await (
      await fetch(variables.constants.API_URL + '/quotes/languages', {
        signal: this.controller.signal,
      })
    ).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    const quoteLanguages = [];
    data.forEach((item) => {
      quoteLanguages.push({
        name: item,
        value: item,
      });
    });

    this.setState({
      quoteLanguages,
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        quoteLanguages: [
          {
            name: this.getMessage('modals.main.marketplace.offline.description'),
            value: 'loading',
          },
        ],
      });
    }

    this.getQuoteLanguages();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <>
        <span className="mainTitle">
          {this.getMessage('modals.main.settings.sections.language.title')}
        </span>
        <div className={'languageSettings'}>
          <Radio name="language" options={languages} element=".other" />
        </div>
        <span className={'mainTitle'}>
          {this.getMessage('modals.main.settings.sections.language.quote')}
        </span>
        <div className={'languageSettings'}>
          <Radio name="quotelanguage" options={this.state.quoteLanguages} category="quote" />
        </div>
      </>
    );
  }
}
