import { useState } from 'react';
import { UserInterface } from '../types';
import { Link } from 'react-router-dom';
import SigninAccount from '../components/Login/SigninAccount';
import LoginAccount from '../components/Login/LoginAccount';
import { faker } from '@faker-js/faker';

export interface FormDataUser {
  login: string;
  password: string;
  pwdConfirm?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  avatar?: string;
}

export default function AccountConnection() {
  const [userCreated, setUserCreated] = useState<UserInterface>();

  const generateUser = (): FormDataUser => {
    const genders: ('male' | 'female')[] = ['male', 'female'];
    const randomGender = genders[Math.floor(Math.random() * 10) % 2];

    const firstNameG = faker.person
      .firstName(randomGender)
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const lastNameG = faker.person
      .lastName(randomGender)
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const loginG = faker.internet
      .userName({
        firstName: firstNameG,
        lastName: lastNameG,
      })
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const emailG = faker.internet.email({
      firstName: firstNameG,
      lastName: lastNameG,
    });
    const avatarG = faker.image.urlLoremFlickr({
      category: 'people',
    });

    const data: FormDataUser = {
      firstName: firstNameG,
      lastName: lastNameG,
      login: loginG,
      email: emailG,
      password: 'Password1!',
      description: faker.lorem.sentence(),
      avatar: avatarG,
    };
    return data;
  };

  window.opener.postMessage({ msg: 'resize', width: 900, height: 550 }, '*');

  return (
    <div className="bg-inherit">
      {/* link prev page */}
      <div className="absolute top-0 right-0 m-5 text-blue-500 font-bold">
        <Link
          to={
            'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2F' +
            window.location.hostname +
            '%3A' +
            3006 +
            '%2Foauthredirection&response_type=code'
          }
        >
          Login Intra
        </Link>
      </div>

      <div className="absolute top-0 left-0 m-5 text-blue-500 font-bold">
        <Link to="/connection">Retour</Link>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold my-10">Account connection</h1>
      </div>

      <div className="flex justify-around">
        <SigninAccount
          setUserCreated={setUserCreated}
          generateUser={generateUser}
        />

        <div className="border-l-2"></div>

        <LoginAccount
          setUserCreated={setUserCreated}
          userCreated={userCreated}
          generateUser={generateUser}
        />
      </div>
    </div>
  );
}
