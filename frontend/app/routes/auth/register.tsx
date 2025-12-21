import PageMeta from "~/components/common/PageMeta";
import RegisterForm from "~/components/auth/RegisterForm";

export function meta() {
  return [{ title: "Crear cuenta" }];
}

export default function Register() {
  return (
    <>
      <PageMeta
        title="Registro | Django React Auth"
        description="Crear una cuenta"
      />
      <RegisterForm />
    </>
  );
}
