module.exports = function (context) {
	const fs = require('fs');
	const _ = require('lodash');

	const scheme = 'flowkey';
	const insertIntent = '<intent-filter android:label="ShareIntent" android:name="ShareIntent"><action android:name="android.intent.action.SEND" /><category android:name="android.intent.category.DEFAULT" /><data android:mimeType="*/*" /><data android:host="*" /><data android:pathPattern=".*\\.xri" /><data android:pathPattern=".*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\..*\\.xri" /><data android:pathPattern=".*\\..*\\..*\\..*\\..*\\..*\\.xri" /></intent-filter>';
	const manifestPath = context.opts.projectRoot + '/platforms/android/AndroidManifest.xml';
	const androidManifest = fs.readFileSync(manifestPath).toString();
	if (!androidManifest.includes('android:scheme="${scheme}"')) {
		const manifestLines = androidManifest.split(/\r?\n/);
		const lineNo = _.findIndex(manifestLines, (line) => line.includes('@string/activity_name'))
		manifestLines.splice(lineNo + 1, 0, insertIntent);
		fs.writeFileSync(manifestPath, manifestLines.join('\n'));
	}
};