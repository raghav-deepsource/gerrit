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
import './gr-reviewer-list';
import {
  mockPromise,
  queryAll,
  queryAndAssert,
  stubRestApi,
} from '../../../test/test-utils';
import {GrReviewerList} from './gr-reviewer-list';
import {
  createAccountDetailWithId,
  createChange,
  createDetailedLabelInfo,
} from '../../../test/test-data-generators';
import {GrButton} from '../../shared/gr-button/gr-button';
import {AccountId, EmailAddress} from '../../../types/common';
import {GrAccountChip} from '../../shared/gr-account-chip/gr-account-chip';
import './gr-reviewer-list';

const basicFixture = fixtureFromElement('gr-reviewer-list');

suite('gr-reviewer-list tests', () => {
  let element: GrReviewerList;

  setup(async () => {
    element = basicFixture.instantiate();

    stubRestApi('removeChangeReviewer').returns(
      Promise.resolve({...new Response(), ok: true})
    );
    await element.updateComplete;
  });

  test('controls hidden on immutable element', async () => {
    element.mutable = false;
    await element.updateComplete;

    assert.isTrue(
      queryAndAssert(element, '.controlsContainer').hasAttribute('hidden')
    );

    element.mutable = true;
    await element.updateComplete;

    assert.isFalse(
      queryAndAssert(element, '.controlsContainer').hasAttribute('hidden')
    );
  });

  test('add reviewer button opens reply dialog', async () => {
    const dialogShown = mockPromise();
    element.addEventListener('show-reply-dialog', () => {
      dialogShown.resolve();
    });
    queryAndAssert<GrButton>(element, '.addReviewer').click();
    await dialogShown;
  });

  test('only show remove for removable reviewers', async () => {
    element.mutable = true;
    element.change = {
      ...createChange(),
      owner: {
        ...createAccountDetailWithId(1),
      },
      reviewers: {
        REVIEWER: [
          {
            ...createAccountDetailWithId(2),
            name: 'Bojack Horseman',
            email: 'SecretariatRulez96@hotmail.com' as EmailAddress,
          },
          {
            _account_id: 3 as AccountId,
            name: 'Pinky Penguin',
          },
        ],
        CC: [
          {
            ...createAccountDetailWithId(4),
            name: 'Diane Nguyen',
            email: 'macarthurfellow2B@juno.com' as EmailAddress,
          },
          {
            email: 'test@e.mail' as EmailAddress,
          },
        ],
      },
      removable_reviewers: [
        {
          _account_id: 3 as AccountId,
          name: 'Pinky Penguin',
        },
        {
          ...createAccountDetailWithId(4),
          name: 'Diane Nguyen',
          email: 'macarthurfellow2B@juno.com' as EmailAddress,
        },
        {
          email: 'test@e.mail' as EmailAddress,
        },
      ],
    };
    await element.updateComplete;
    const chips = queryAll<GrAccountChip>(element, 'gr-account-chip');
    assert.equal(chips.length, 4);

    for (const el of Array.from(chips)) {
      const accountID = el.account!._account_id || el.account!.email;
      assert.ok(accountID);

      const buttonEl = queryAndAssert(el, 'gr-button');
      if (accountID === 2) {
        assert.isTrue(buttonEl.hasAttribute('hidden'));
      } else {
        assert.isFalse(buttonEl.hasAttribute('hidden'));
      }
    }
  });

  suite('_handleRemove', () => {
    let removeReviewerStub: sinon.SinonStub;

    const reviewerWithId = {
      ...createAccountDetailWithId(2),
      name: 'Some name',
    };

    const reviewerWithIdAndEmail = {
      ...createAccountDetailWithId(4),
      name: 'Some other name',
      email: 'example@' as EmailAddress,
    };

    const reviewerWithEmailOnly = {
      email: 'example2@example' as EmailAddress,
    };

    let chips: GrAccountChip[];

    setup(async () => {
      removeReviewerStub = sinon
        .stub(element, 'removeReviewer')
        .returns(Promise.resolve(new Response()));
      element.mutable = true;

      const allReviewers = [
        reviewerWithId,
        reviewerWithIdAndEmail,
        reviewerWithEmailOnly,
      ];

      element.change = {
        ...createChange(),
        owner: {
          ...createAccountDetailWithId(1),
        },
        reviewers: {
          REVIEWER: allReviewers,
        },
        removable_reviewers: allReviewers,
      };
      await element.updateComplete;
      chips = Array.from(queryAll<GrAccountChip>(element, 'gr-account-chip'));
      assert.equal(chips.length, allReviewers.length);
    });

    test('_handleRemove for account with accountId only', async () => {
      const accountChip = chips.find(
        chip => chip.account!._account_id === reviewerWithId._account_id
      );
      accountChip!._handleRemoveTap(new MouseEvent('click'));
      await element.updateComplete;
      assert.isTrue(removeReviewerStub.calledOnce);
      assert.isTrue(removeReviewerStub.calledWith(reviewerWithId._account_id));
      expect(element.change!.reviewers.REVIEWER).to.have.deep.members([
        reviewerWithIdAndEmail,
        reviewerWithEmailOnly,
      ]);
    });

    test('_handleRemove for account with accountId and email', async () => {
      const accountChip = chips.find(
        chip => chip.account!._account_id === reviewerWithIdAndEmail._account_id
      );
      accountChip!._handleRemoveTap(new MouseEvent('click'));
      await element.updateComplete;
      assert.isTrue(removeReviewerStub.calledOnce);
      assert.isTrue(
        removeReviewerStub.calledWith(reviewerWithIdAndEmail._account_id)
      );
      expect(element.change!.reviewers.REVIEWER).to.have.deep.members([
        reviewerWithId,
        reviewerWithEmailOnly,
      ]);
    });

    test('_handleRemove for account with email only', async () => {
      const accountChip = chips.find(
        chip => chip.account!.email === reviewerWithEmailOnly.email
      );
      accountChip!._handleRemoveTap(new MouseEvent('click'));
      await element.updateComplete;
      assert.isTrue(removeReviewerStub.calledOnce);
      assert.isTrue(removeReviewerStub.calledWith(reviewerWithEmailOnly.email));
      expect(element.change!.reviewers.REVIEWER).to.have.deep.members([
        reviewerWithId,
        reviewerWithIdAndEmail,
      ]);
    });
  });

  test('tracking reviewers and ccs', async () => {
    let counter = 0;
    function makeAccount() {
      return {_account_id: counter++ as AccountId};
    }

    const owner = makeAccount();
    const reviewer = makeAccount();
    const cc = makeAccount();
    const reviewers = {
      REMOVED: [makeAccount()],
      REVIEWER: [owner, reviewer],
      CC: [owner, cc],
    };

    element.ccsOnly = false;
    element.reviewersOnly = false;
    element.change = {
      ...createChange(),
      owner,
      reviewers,
    };
    await element.updateComplete;
    assert.deepEqual(element.reviewers, [reviewer, cc]);

    element.reviewersOnly = true;
    element.change = {
      ...createChange(),
      owner,
      reviewers,
    };
    await element.updateComplete;

    assert.deepEqual(element.reviewers, [reviewer]);

    element.ccsOnly = true;
    element.reviewersOnly = false;
    element.change = {
      ...createChange(),
      owner,
      reviewers,
    };
    await element.updateComplete;

    assert.deepEqual(element.reviewers, [cc]);
  });

  test('handleAddTap passes mode with event', () => {
    const fireStub = sinon.stub(element, 'dispatchEvent');
    const e = {...new Event(''), preventDefault() {}};

    element.ccsOnly = false;
    element.reviewersOnly = false;
    element.handleAddTap(e);
    assert.equal(fireStub.lastCall.args[0].type, 'show-reply-dialog');
    assert.deepEqual((fireStub.lastCall.args[0] as CustomEvent).detail, {
      value: {
        reviewersOnly: false,
        ccsOnly: false,
      },
    });

    element.reviewersOnly = true;
    element.handleAddTap(e);
    assert.equal(fireStub.lastCall.args[0].type, 'show-reply-dialog');
    assert.deepEqual((fireStub.lastCall.args[0] as CustomEvent).detail, {
      value: {reviewersOnly: true, ccsOnly: false},
    });

    element.ccsOnly = true;
    element.reviewersOnly = false;
    element.handleAddTap(e);
    assert.equal(fireStub.lastCall.args[0].type, 'show-reply-dialog');
    assert.deepEqual((fireStub.lastCall.args[0] as CustomEvent).detail, {
      value: {ccsOnly: true, reviewersOnly: false},
    });
  });

  test('dont show all reviewers button with 4 reviewers', async () => {
    const reviewers = [];
    for (let i = 0; i < 4; i++) {
      reviewers.push({
        ...createAccountDetailWithId(i),
        email: `${i}reviewer@google.com` as EmailAddress,
        name: `reviewer${i}`,
      });
    }
    element.ccsOnly = true;

    element.change = {
      ...createChange(),
      owner: {
        ...createAccountDetailWithId(111),
      },
      reviewers: {
        CC: reviewers,
      },
    };
    await element.updateComplete;

    assert.equal(element.hiddenReviewerCount, 0);
    assert.equal(element.displayedReviewers.length, 4);
    assert.equal(element.reviewers.length, 4);
    assert.isTrue(queryAndAssert<GrButton>(element, '.hiddenReviewers').hidden);
  });

  test('account owner comes first in list of reviewers', async () => {
    const reviewers = [];
    for (let i = 0; i < 4; i++) {
      reviewers.push({
        ...createAccountDetailWithId(i),
        email: `${i}reviewer@google.com` as EmailAddress,
        name: `reviewer${i}`,
      });
    }
    element.reviewersOnly = true;
    element.account = {
      ...createAccountDetailWithId(1),
    };
    element.change = {
      ...createChange(),
      owner: {
        ...createAccountDetailWithId(11),
      },
      reviewers: {
        REVIEWER: reviewers,
      },
    };
    await element.updateComplete;

    assert.equal(element.displayedReviewers[0]._account_id, 1 as AccountId);
  });

  test('show all reviewers button with 9 reviewers', async () => {
    const reviewers = [];
    for (let i = 0; i < 9; i++) {
      reviewers.push({
        ...createAccountDetailWithId(i),
        email: `${i}reviewer@google.com` as EmailAddress,
        name: `reviewer${i}`,
      });
    }
    element.ccsOnly = true;

    element.change = {
      ...createChange(),
      owner: {
        ...createAccountDetailWithId(111),
      },
      reviewers: {
        CC: reviewers,
      },
    };
    await element.updateComplete;

    assert.equal(element.hiddenReviewerCount, 3);
    assert.equal(element.displayedReviewers.length, 6);
    assert.equal(element.reviewers.length, 9);
    assert.isFalse(
      queryAndAssert<GrButton>(element, '.hiddenReviewers').hidden
    );
  });

  test('show all reviewers button', async () => {
    const reviewers = [];
    for (let i = 0; i < 100; i++) {
      reviewers.push({
        ...createAccountDetailWithId(i),
        email: `${i}reviewer@google.com` as EmailAddress,
        name: `reviewer${i}`,
      });
    }
    element.ccsOnly = true;

    element.change = {
      ...createChange(),
      owner: {
        ...createAccountDetailWithId(111),
      },
      reviewers: {
        CC: reviewers,
      },
    };

    await element.updateComplete;

    assert.equal(element.hiddenReviewerCount, 94);
    assert.equal(element.displayedReviewers.length, 6);
    assert.equal(element.reviewers.length, 100);
    assert.isFalse(
      queryAndAssert<GrButton>(element, '.hiddenReviewers').hidden
    );

    queryAndAssert<GrButton>(element, '.hiddenReviewers').click();

    await element.updateComplete;

    assert.equal(element.hiddenReviewerCount, 0);
    assert.equal(element.displayedReviewers.length, 100);
    assert.equal(element.reviewers.length, 100);
    assert.isTrue(queryAndAssert<GrButton>(element, '.hiddenReviewers').hidden);
  });

  test('votable labels', async () => {
    element.change = {
      ...createChange(),
      labels: {
        Foo: {
          ...createDetailedLabelInfo(),
          all: [
            {
              _account_id: 7 as AccountId,
              permitted_voting_range: {max: 2, min: 0},
            },
          ],
        },
        Bar: {
          ...createDetailedLabelInfo(),
          all: [
            {
              ...createAccountDetailWithId(1),
              permitted_voting_range: {max: 1, min: 0},
            },
            {
              _account_id: 7 as AccountId,
              permitted_voting_range: {max: 1, min: 0},
            },
          ],
        },
        FooBar: {
          ...createDetailedLabelInfo(),
          all: [{_account_id: 7 as AccountId, value: 0}],
        },
      },
      permitted_labels: {
        Foo: ['-1', ' 0', '+1', '+2'],
        FooBar: ['-1', ' 0'],
      },
    };
    await element.updateComplete;

    assert.strictEqual(
      element.computeVoteableText({...createAccountDetailWithId(1)}),
      'Bar: +1'
    );
    assert.strictEqual(
      element.computeVoteableText({...createAccountDetailWithId(7)}),
      'Foo: +2, Bar: +1, FooBar: 0'
    );
    assert.strictEqual(
      element.computeVoteableText({...createAccountDetailWithId(2)}),
      ''
    );
  });

  test('fails gracefully when all is not included', async () => {
    element.change = {
      ...createChange(),
      labels: {Foo: {}},
      permitted_labels: {
        Foo: ['-1', ' 0', '+1', '+2'],
      },
    };
    await element.updateComplete;
    assert.strictEqual(
      element.computeVoteableText({...createAccountDetailWithId(1)}),
      ''
    );
  });
});
