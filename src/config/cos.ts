export default () => ({
	cos: {
		SecretId: process.env.COS_SECRET_ID,
		SecretKey: process.env.COS_SECRET_KEY,
		Bucket: process.env.COS_BUCKET,
		Region: process.env.COS_REGION,
	},
});