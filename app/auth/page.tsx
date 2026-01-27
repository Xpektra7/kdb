// import { SignIn } from "@/components/auth/signin";
// import { auth, signOut } from "@/auth";
// // import { signOut } from "@/auth";

// export default async function AuthPage() {

//   const session = await auth()


//   const data = await fetch('http://localhost:3000/api/user');
//   const user = await data.json();

//   console.log('User data:', user);
//   if (session) {
//     return (
//       <div>
//         <div>You are already signed in. {JSON.stringify(session.user)}</div>;
//         <form
//           action={async () => {
//             "use server"
//             await signOut()
//           }}
//         >
//           <button type="submit">Sign out</button>
//         </form>
//       </div>
//     )
//   }
//   return <SignIn />;
// }