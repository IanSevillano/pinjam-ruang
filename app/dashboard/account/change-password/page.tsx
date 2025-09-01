// // app/dashboard/account/change-password/page.tsx


// app/dashboard/account/change-password/page.tsx
"use client";

import { useState } from "react";
import VerifyEmailStep from "./verify-email";
import VerifyCodeStep from "./verify-code";
import NewPasswordStep from "./new-password";

export default function ChangePasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Ganti Password
        </h1>

        {step === "email" && (
          <VerifyEmailStep
            onSuccess={(email) => {
              setEmail(email);
              setStep("code");
            }}
          />
        )}

        {step === "code" && (
          <VerifyCodeStep
            email={email}
            onSuccess={(token) => {
              setToken(token);
              setStep("password");
            }}
            onBack={() => setStep("email")}
          />
        )}

        {step === "password" && (
          <NewPasswordStep
            email={email}
            token={token}
            onBack={() => setStep("code")}
          />
        )}
      </main>
    </div>
  );
}



// 'use client';

// import { useState } from 'react';
// import VerifyEmailStep from './verify-email';
// import VerifyCodeStep from './verify-code';
// import NewPasswordStep from './new-password';

// export default function ChangePasswordPage() {
//   const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">Ganti Password</h1>

//         {step === 'email' && (
//           <VerifyEmailStep
//             onSuccess={(email) => {
//               setEmail(email);
//               setStep('code');
//             }}
//           />
//         )}

//         {step === 'code' && (
//           <VerifyCodeStep
//             email={email}
//             onSuccess={(token) => {
//               setToken(token);
//               setStep('password');
//             }}
//             onBack={() => setStep('email')}
//           />
//         )}

//         {step === 'password' && (
//           <NewPasswordStep
//             email={email}
//             token={token}
//             onBack={() => setStep('code')}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
