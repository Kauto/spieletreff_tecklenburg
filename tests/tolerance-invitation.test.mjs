import assert from 'node:assert/strict';
import { test } from 'node:test';

import { detectInvitationLanguage } from '../src/lib/tolerance-invitation.ts';

test('invitation language follows the first supported browser language', () => {
	assert.equal(detectInvitationLanguage(['de-DE', 'en']), 'de');
	assert.equal(detectInvitationLanguage(['en-GB', 'de']), 'en');
	assert.equal(detectInvitationLanguage(['uk-UA']), 'uk');
	assert.equal(detectInvitationLanguage(['ua']), 'uk');
	assert.equal(detectInvitationLanguage(['ar-SY']), 'ar');
	assert.equal(detectInvitationLanguage(['sw-KE']), 'sw');
	assert.equal(detectInvitationLanguage(['hi-IN']), 'hi');
	assert.equal(detectInvitationLanguage(['fr-FR', 'nl']), 'de');
	assert.equal(detectInvitationLanguage([]), 'de');
});
