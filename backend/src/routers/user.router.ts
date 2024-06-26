import Router from 'express'
import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { sample_users } from '../data'
import { UserModel } from '../models/user.model'

const router = Router()

router.get(
	'/seed',
	expressAsyncHandler(async (req, res) => {
		const usersCount = await UserModel.countDocuments()
		if (usersCount > 0) {
			res.send('Seed users is update!')
			return
		}
		await UserModel.create(sample_users)
		res.send('Seed users is done!')
	})
)

router.post(
	'/login',
	expressAsyncHandler(async (req, res) => {
		const { email, password } = req.body // Destructuring Assignment
		const user = await UserModel.findOne({ email, password })

		if (user) {
			res.send(generateTokenResponse(user))
		} else {
			res.status(400).send('User name or password is not valid!')
		}
	})
)

const generateTokenResponse = (user: any) => {
	const token = jwt.sign(
		{
			email: user.email,
			isAdmin: user.isAdmin,
		},
		'SomeRandomText',
		{
			expiresIn: '30d',
		}
	)

	user.token = token
	return user
}

export default router
