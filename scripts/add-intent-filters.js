module.exports = function (context) {
	const fs = require('fs');
	const _ = require('lodash');

	const scheme = 'flowkey';
	const insertIntent = '<intent-filter><action android:name="android.intent.action.VIEW" /><action android:name="android.intent.action.EDIT" /><category android:name="android.intent.category.BROWSABLE" /><category android:name="android.intent.category.DEFAULT" />'+
        '<data android:scheme="file" android:mimeType="*/*" android:host="*" />'+
		'<data android:pathPattern=".*\\.xri" /><data android:pathPattern=".*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\..*\\..*\\.xri" /></intent-filter>'+
		'<intent-filter><action android:name="android.intent.action.VIEW" /><action android:name="android.intent.action.EDIT" /><category android:name="android.intent.category.BROWSABLE" /><category android:name="android.intent.category.DEFAULT" />'+
        '<data android:scheme="content" android:mimeType="*/*" android:host="*" />'+
        '<data android:pathPattern=".*\\.xri" /><data android:pathPattern=".*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\.xri" />'+
        '<data android:pathPattern=".*\\..*\\..*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\..*\\..*\\.xri" /></intent-filter>';
	const manifestPath = context.opts.projectRoot + '/platforms/android/AndroidManifest.xml';
	const androidManifest = fs.readFileSync(manifestPath).toString();
	if (!androidManifest.includes('android:scheme="${scheme}"')) {
		const manifestLines = androidManifest.split(/\r?\n/);
		const lineNo = _.findIndex(manifestLines, (line) => line.includes('@string/activity_name'))
		manifestLines.splice(lineNo + 1, 0, insertIntent);
		fs.writeFileSync(manifestPath, manifestLines.join('\n'));
	}
};