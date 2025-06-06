
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(hookSecret);
    
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
        user_metadata: {
          full_name?: string;
        };
      };
      email_data: {
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    const userName = user.user_metadata?.full_name || "Pengguna";
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const emailResponse = await resend.emails.send({
      from: "Elsa Finance <onboarding@resend.dev>",
      to: [user.email],
      subject: "Konfirmasi Email Anda untuk Web Management Keuangan",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; font-size: 28px; margin: 0; font-weight: bold;">
                🎉 Selamat Datang di Elsa Finance! 💰
              </h1>
            </div>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
              Halo <strong>${userName}</strong>, 👋
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 25px;">
              Terima kasih telah mendaftar di <strong>Web Management Keuangan</strong>. ✨
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px;">
              Untuk mengaktifkan akun Anda dan mulai menggunakan layanan kami, silakan konfirmasi alamat email Anda dengan mengklik tombol di bawah ini:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;
                        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
                        transition: transform 0.2s;">
                👉 Konfirmasi Email Anda 🚀
              </a>
            </div>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
              <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.5;">
                💡 <strong>Tips:</strong> Setelah konfirmasi, kamu bisa langsung mulai mencatat pemasukan, pengeluaran, dan tabunganmu dengan mudah!
              </p>
            </div>
            
            <p style="font-size: 14px; color: #888; line-height: 1.6; margin-top: 30px;">
              Jika Anda tidak merasa mendaftar di layanan kami, silakan abaikan email ini. 🤷‍♀️
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #aaa; margin: 0;">
                Dibuat dengan ❤️ untuk mengelola keuangan yang lebih bijak! 💎
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
