/**
 * @license
 * Copyright (C) 2015 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../../test/common-test-setup-karma';
import './gr-account-dropdown';
import {GrAccountDropdown} from './gr-account-dropdown';
import {AccountInfo} from '../../../types/common';
import {createServerInfo} from '../../../test/test-data-generators';

const basicFixture = fixtureFromElement('gr-account-dropdown');

suite('gr-account-dropdown tests', () => {
  let element: GrAccountDropdown;

  setup(() => {
    element = basicFixture.instantiate();
  });

  test('account information', () => {
    element.account = {name: 'John Doe', email: 'john@doe.com'} as AccountInfo;
    assert.deepEqual(element.topContent, [
      {text: 'John Doe', bold: true},
      {text: 'john@doe.com'},
    ]);
  });

  test('test for account without a name', () => {
    element.account = {id: '0001'} as AccountInfo;
    assert.deepEqual(element.topContent, [
      {text: 'Anonymous', bold: true},
      {text: ''},
    ]);
  });

  test('test for account without a name but using config', () => {
    element.config = {
      ...createServerInfo(),
      user: {
        anonymous_coward_name: 'WikiGerrit',
      },
    };
    element.account = {id: '0001'} as AccountInfo;
    assert.deepEqual(element.topContent, [
      {text: 'WikiGerrit', bold: true},
      {text: ''},
    ]);
  });

  test('test for account name as an email', () => {
    element.config = {
      ...createServerInfo(),
      user: {
        anonymous_coward_name: 'WikiGerrit',
      },
    };
    element.account = {email: 'john@doe.com'} as AccountInfo;
    assert.deepEqual(element.topContent, [
      {text: 'john@doe.com', bold: true},
      {text: 'john@doe.com'},
    ]);
  });

  test('switch account', () => {
    // Missing params.
    assert.isUndefined(element._getLinks());
    assert.isUndefined(element._getLinks(undefined));

    // No switch account link.
    assert.equal(element._getLinks('', '')!.length, 3);

    // Unparameterized switch account link.
    let links = element._getLinks('/switch-account', '')!;
    assert.equal(links.length, 4);
    assert.deepEqual(links[2], {
      name: 'Switch account',
      url: '/switch-account',
      external: true,
    });

    // Parameterized switch account link.
    links = element._getLinks('/switch-account${path}', '/c/123')!;
    assert.equal(links.length, 4);
    assert.deepEqual(links[2], {
      name: 'Switch account',
      url: '/switch-account/c/123',
      external: true,
    });
  });

  test('_interpolateUrl', () => {
    const replacements = {
      foo: 'bar',
      test: 'TEST',
    };
    const interpolate = (url: string) =>
      element._interpolateUrl(url, replacements);

    assert.equal(interpolate('test'), 'test');
    assert.equal(interpolate('${test}'), 'TEST');
    assert.equal(
      interpolate('${}, ${test}, ${TEST}, ${foo}'),
      '${}, TEST, , bar'
    );
  });
});
