import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input"; // 👈 Importa tu Input
import { useAuth } from "../context/AuthContext";
import registerImage from "../images/plaza.png"; // 👈 tu imagen

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("✅ Registro exitoso");
    } catch (err) {
      console.error(err);
      alert("❌ Error en registro");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-100">
      {/* 🔹 Izquierda: Imagen con overlay */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={registerImage}
          alt="Login ilustrativo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🔹 Derecha: Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Encabezado */}
            <div
              className="p-6 text-white text-center"
              style={{ backgroundColor: "#325341" }}
            >
              <h2 className="text-2xl font-bold">Crear Cuenta</h2>
            </div>

            {/* Cuerpo del formulario */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={form.name}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={form.email}
                  onChange={handleChange}
                />

                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                />

                <Input
                  label="Confirmar Contraseña"
                  name="password_confirmation"
                  type="password"
                  placeholder="********"
                  value={form.password_confirmation}
                  onChange={handleChange}
                />

                <Button type="submit" className="w-full">
                  Registrarme
                </Button>
              </form>

              <p className="mt-6 text-sm text-gray-600 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
