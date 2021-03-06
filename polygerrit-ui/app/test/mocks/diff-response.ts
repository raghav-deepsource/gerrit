/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
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

import {DiffInfo} from '../../types/diff';

export function getMockDiffResponse(): DiffInfo {
  // Return new response, so tests can't affect each other - if a test somehow
  // modifies it, the future calls return original value
  // Do not put it to a const outside of a method
  return {
    meta_a: {
      name: 'lorem-ipsum.txt',
      content_type: 'text/plain',
      lines: 45,
    },
    meta_b: {
      name: 'lorem-ipsum.txt',
      content_type: 'text/plain',
      lines: 48,
    },
    intraline_status: 'OK',
    change_type: 'MODIFIED',
    diff_header: [
      'diff --git a/lorem-ipsum.txt b/lorem-ipsum.txt',
      'index b2adcf4..554ae49 100644',
      '--- a/lorem-ipsum.txt',
      '+++ b/lorem-ipsum.txt',
    ],
    content: [
      {
        ab: [
          'Lorem ipsum dolor sit amet, suspendisse inceptos vehicula, ' +
            'nulla phasellus.',
          'Mattis lectus.',
          'Sodales duis.',
          'Orci a faucibus.',
        ],
      },
      {
        b: [
          'Nullam neque, ligula ac, id blandit.',
          'Sagittis tincidunt torquent, tempor nunc amet.',
          'At rhoncus id.',
        ],
      },
      {
        ab: [
          'Sem nascetur, erat ut, non in.',
          'A donec, venenatis pellentesque dis.',
          'Mauris mauris.',
          'Quisque nisl duis, facilisis viverra.',
          'Justo purus, semper eget et.',
        ],
      },
      {
        a: [
          'Est amet, vestibulum pellentesque.',
          'Erat ligula.',
          'Justo eros.',
          'Fringilla quisque.',
        ],
      },
      {
        ab: [
          'Arcu eget, rhoncus amet cursus, ipsum elementum.',
          'Eros suspendisse.',
        ],
      },
      {
        a: ['Rhoncus tempor, ultricies aliquam ipsum.'],
        b: ['Rhoncus tempor, ultricies praesent ipsum.'],
        edit_a: [[26, 7]],
        edit_b: [[26, 8]],
      },
      {
        ab: [
          'Sollicitudin duis.',
          'Blandit blandit, ante nisl fusce.',
          'Felis ac at, tellus consectetuer.',
          'Sociis ligula sapien, egestas leo.',
          'Cum pulvinar, sed mauris, cursus neque velit.',
          'Augue porta lobortis.',
          'Nibh lorem, amet fermentum turpis, vel pulvinar diam.',
          'Id quam ipsum, id urna et, massa suspendisse.',
          'Ac nec, nibh praesent.',
          'Rutrum vestibulum.',
          'Est tellus, bibendum habitasse.',
          'Justo facilisis, vel nulla.',
          'Donec eu, vulputate neque aliquam, nulla dui.',
          'Risus adipiscing in.',
          'Lacus arcu arcu.',
          'Urna velit.',
          'Urna a dolor.',
          'Lectus magna augue, convallis mattis tortor, sed tellus ' +
            'consequat.',
          'Etiam dui, blandit wisi.',
          'Mi nec.',
          'Vitae eget vestibulum.',
          'Ullamcorper nunc ante, nec imperdiet felis, consectetur in.',
          'Ac eget.',
          'Vel fringilla, interdum pellentesque placerat, proin ante.',
        ],
      },
      {
        b: [
          'Eu congue risus.',
          'Enim ac, quis elementum.',
          'Non et elit.',
          'Etiam aliquam, diam vel nunc.',
        ],
      },
      {
        ab: [
          'Nec at.',
          'Arcu mauris, venenatis lacus fermentum, praesent duis.',
          'Pellentesque amet et, tellus duis.',
          'Ipsum arcu vitae, justo elit, sed libero tellus.',
          'Metus rutrum euismod, vivamus sodales, vel arcu nisl.',
        ],
      },
    ],
  };
}
