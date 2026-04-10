import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const { signIn } = await import("@/lib/api/auth");
      const result = await signIn(email, password);
      setProfile(result.profile);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-gray-400">
          Entre na sua conta para acessar o painel de tecnologias.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm rounded-xl px-4 py-3 font-medium flex items-center animate-[fadeIn_0.3s_ease-out]">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0"></div>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="group space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <Mail
                className="text-gray-400 group-hover:text-blue-400 transition-colors"
                size={18}
              />
            }
            required
            autoComplete="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>

        <div className="group space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <Lock
                className="text-gray-400 group-hover:text-blue-400 transition-colors"
                size={18}
              />
            }
            required
            autoComplete="current-password"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
          className="text-sm text-brand-yellow hover:text-white transition-colors duration-200"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-brand-yellow-dark to-brand-yellow hover:from-brand-yellow hover:to-brand-yellow-light text-brand-black font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-brand-yellow/30 transition-all duration-300 flex items-center justify-center group"
        size="lg"
        loading={loading}
      >
        <span>Acessar Painel</span>
        {!loading && (
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </Button>

      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Ainda não possui acesso?{" "}
          <Link
            to="/register"
            className="text-white font-semibold hover:text-brand-yellow transition-colors duration-200 ml-1"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  );
}
