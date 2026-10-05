import { supabase } from "../config/database";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends AuthCredentials {
  full_name?: string;
}

export async function signUp(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: input.full_name ? { full_name: input.full_name } : undefined,
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(input: AuthCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error) throw error;
  return data;
}

export async function refreshSession(refreshToken: string) {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) throw error;
  return data;
}

export async function getUser(accessToken: string) {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw error ?? new Error("Session tidak valid");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role) {
    data.user.app_metadata = {
      ...(data.user.app_metadata ?? {}),
      role: profile.role,
    };
  }

  return data.user;
}

export async function signOut(accessToken: string) {
  const { error } = await supabase.auth.admin.signOut(accessToken, "global");

  if (error) throw error;
}
