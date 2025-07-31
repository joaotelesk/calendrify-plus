import LoginForm from "./LoginForm";

export default function LoginF() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="https://www.mpbateria.com.br/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <img
            src="/assets/mpLogo.png"
            alt="Logo mp space"
            width={100}
            height={100}
            className="mb-4"
          />
          MP Acessórios de Bateria
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
