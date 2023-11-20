import { useEffect, useState } from 'react'
import './App.css'
import { tsRestClient } from './ts-rest-client'
import { Auth, AuthProvider, GoogleAuthProvider, getAuth, getIdToken, getRedirectResult, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithRedirect } from 'firebase/auth'


function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [formMail, setFormMail] = useState('');
  const auth = getAuth()

  const { data, isLoading } = tsRestClient.getUserInfo.useQuery([])
  const { mutate: loginMutate } = tsRestClient.login.useMutation()
  const { mutate: logoutMutate } = tsRestClient.logout.useMutation()
  const { mutate: deleteUser } = tsRestClient.deleteUser.useMutation()

  useEffect(() => {

    (async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const email = window.prompt('確認のためメールアドレスを入力してください')
          const result = await signInWithEmailLink(auth, email ?? '', window.location.href);
          const idToken = await getIdToken(result.user, true);
          loginMutate({ body: { idToken } })
        } catch (e) {
          alert('ログインに失敗しました')
        } finally {
          location.href = window.location.origin
        }
      }
      try {
        const redirectSignInResult = await getRedirectResult(auth);
        if (redirectSignInResult) {
          const idToken = await getIdToken(redirectSignInResult.user, true);
          loginMutate({ body: { idToken } })
          location.href = window.location.origin;
        }
        if (!data?.body) {
          return;
        }
        setName(data.body.email ?? '');
        setEmail(data.body.email ?? '');
        setLoggedIn(true);
      }
      catch (e) {
        setLoggedIn(false);
      }
    })()


  }, [isLoading])

  const login = async (auth: Auth, provider: AuthProvider) => {
    await signInWithRedirect(auth, provider)
  }

  const logout = async () => {
    try {
      logoutMutate({})
      location.href = window.location.origin;
    } catch (e) {
      alert('エラーが発生しログアウトが適切にできませんでした。')
    }
  }

  const sendMailLink = () => {
    const actionCodeSettings = {
      url: location.origin + '/hoge',
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, formMail, actionCodeSettings).then(() => {
      alert('メールを送信しました。')
    }).catch(() => {
      alert('メールの送信ができません。')
    })
  }

  const withdraw = () => {
    try {
      if (confirm('退会します。よろしいでしょうか？')) {
        deleteUser({})
        location.href = window.location.origin;
      }
    } catch (e) {
      alert('退会に失敗しました。')
    }
  }


  return (
    <>
      {isLoading && <div>ローディング中</div>}
      {!isLoading &&

        <div>
          <h3>名前:{name}</h3>
          <h3>メールアドレス:{email}</h3>
          <div>
            {isLoggedIn ? <button onClick={() => logout()}>ログアウト</button> : <button onClick={() => login(auth, new GoogleAuthProvider())}>ログイン</button>}
          </div>
          <div>
            {isLoggedIn && <button onClick={withdraw}>退会する</button>}
          </div>

          {!isLoggedIn &&
            <div >
              <p>メールリンクログイン</p>
              <input type='email' onChange={(e) => setFormMail(e.target.value)} />
              <button onClick={() => sendMailLink()}>送信</button>
            </div>
          }

        </div>
      }

    </>
  )
}

export default App
