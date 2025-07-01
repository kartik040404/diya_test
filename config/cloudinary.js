// cloudinaryConnect.js
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_SECRET_KEY,
		});
		console.log('Cloudinary Connected Successfully!!');
	} catch (error) {
		console.error('Cloudinary connection failed:', error);
	}
};

export { cloudinary };
