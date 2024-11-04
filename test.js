const avp = require('diameter-avp-object');

// A structure returned by node-diameter
const avpList = [
  [ 'Subscription-Id', [
    [ 'Subscription-Id-Type', 'END_USER_IMSI' ],
    [ 'Subscription-Id-Data', '1234' ]
  ]],
  [ 'Subscription-Id', [
    [ 'Subscription-Id-Type', 'END_USER_E164' ],
    [ 'Subscription-Id-Data', '4321' ]
  ]],
  [ 'Multiple-Services-Credit-Control', [
    [ 'Used-Service-Unit', [
      [ 'CC-Total-Octets', 1000 ]
    ]],
    [ 'Requested-Service-Unit', [
      [ 'CC-Total-Octets', 2000 ]
    ]]
  ]]
];

// Get consolidated object
const avpObj = avp.toObject(avpList);

// Multiple occurences of the same AVP are rolled into an array
const imsi = avpObj.subscriptionId
  .find(sId => sId.subscriptionIdType === 'END_USER_IMSI')
  .subscriptionIdData;

// Single instances are not
const cc = avpObj.multipleServicesCreditControl;

if (cc.ccRequestType === 'UPDATE_REQUEST') {
  const grantedUnits = handleUpdateRequest(
    imsi,
    cc.serviceIdentifier,
    cc.usedServiceUnit.ccTotalOctets,
    cc.requestedServiceUnit.ccTotalOctets
  );

  const avpList = avp.fromObject({
    ccRequestType: cc.ccRequestType,
    ccRequestNumber: avpObj.ccRequestNumber,
    multipleServicesCreditControl: {
      serviceIdentifier: cc.serviceIdentifier,
      ratingGroup: cc.serviceIdentifier,
      resultCode: 'DIAMETER_SUCCESS',
      grantedServiceUnit: {
        ccTotalOctets: grantedUnits
      }
    }
  });

  // Use avpList in the Diameter answer
  // ...
}