'use strict';
const makeController = require('../../../lib/makeController');
const ctrl = makeController('v1', 'auth');

module.exports = {
  discoverStart:       ctrl.create,
  discoverVerify:      ctrl.create,
  passwordRegister:    ctrl.create,
  passwordVerify:      ctrl.create,
  passwordReset:       ctrl.create,
  passwordChange:      ctrl.create,
  passkeyAttest:       ctrl.create,
  passkeyAttestVerify: ctrl.create,
  passkeyAssert:       ctrl.create,
  passkeyAssertVerify: ctrl.create,
  token:               ctrl.create,
  logout:              ctrl.create,
  me:                  ctrl.getAll,
  invitationAccept:    ctrl.create,
  getPolicy:           ctrl.getOne,
  updatePolicy:        ctrl.update,
};
