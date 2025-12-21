import PageMeta from "~/components/common/PageMeta";
import LoginForm from "~/components/auth/LoginForm";

export function meta() {
  return [{ title: "Iniciar sesión" }];
}

export default function Login() {
  return (
    <>
      <PageMeta
        title="Login | Django React Auth"
        description="Inicio de sesión"
      />
      <LoginForm />
    </>
  );
}
