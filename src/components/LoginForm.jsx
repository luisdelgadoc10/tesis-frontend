import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import loginImage from "../images/plaza.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ⚡ Estados para manejo de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // ⚡ Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Error al iniciar sesión";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401) {
          errorMessage = data?.message || "Credenciales incorrectas.";
        } else if (status === 403) {
          errorMessage =
            data?.message || "Usuario inactivo. Contacte al administrador.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (err.request) {
        errorMessage = "Error de conexión. Verifique su conexión a internet.";
      } else {
        errorMessage = err.message || "Error inesperado";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-100">
      {/* 🔹 Izquierda: Imagen con overlay */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={loginImage}
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
              <h2 className="text-2xl font-bold">Panel Administrativo</h2>
            </div>

            {/* Cuerpo del formulario */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ⚡ Mostrar errores */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={form.email}
                  onChange={handleChange}
                  highlightLabel={true}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  highlightLabel={true}
                  required
                  disabled={isLoading}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
