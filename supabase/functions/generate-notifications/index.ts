import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, profile, todayLog } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const notifications: any[] = [];

    // Generate personalized notifications based on user data
    const spermValue = profile?.sperm_value || 50;
    const currentStreak = profile?.current_streak || 0;
    const lastLogDate = todayLog?.date;

    // Streak milestone notifications
    if (currentStreak === 7) {
      notifications.push({
        user_id,
        title: "🔥 7-Day Streak!",
        message: "Congratulations! You've logged 7 days in a row. Keep up the great work!",
        type: "success",
        action_url: "/dashboard"
      });
    } else if (currentStreak === 30) {
      notifications.push({
        user_id,
        title: "🏆 30-Day Streak Champion!",
        message: "Amazing! One month of consistent tracking. You're building lasting habits!",
        type: "success",
        action_url: "/dashboard"
      });
    }

    // Value milestone notifications
    if (spermValue >= 10000 && spermValue < 10100) {
      notifications.push({
        user_id,
        title: "💰 $10K Value Milestone!",
        message: "Your sperm value has reached $10,000! You're making great progress.",
        type: "success",
        action_url: "/analytics"
      });
    } else if (spermValue >= 25000 && spermValue < 25100) {
      notifications.push({
        user_id,
        title: "💎 $25K Value Achievement!",
        message: "Impressive! Your sperm value is now $25,000. Keep optimizing!",
        type: "success",
        action_url: "/analytics"
      });
    } else if (spermValue >= 50000 && spermValue < 50100) {
      notifications.push({
        user_id,
        title: "🌟 $50K Value Reached!",
        message: "Outstanding! You've reached $50,000 value. You're in the top tier!",
        type: "success",
        action_url: "/analytics"
      });
    }

    // Daily reminder if not logged today
    if (!lastLogDate || lastLogDate !== new Date().toISOString().split('T')[0]) {
      const hour = new Date().getHours();
      if (hour >= 18 && hour <= 22) { // Evening reminder
        notifications.push({
          user_id,
          title: "📝 Daily Check-in Reminder",
          message: "Don't forget to log your daily stats! It only takes a minute.",
          type: "reminder",
          action_url: "/tracking"
        });
      }
    }

    // Low value improvement suggestion
    if (spermValue < 5000) {
      notifications.push({
        user_id,
        title: "💡 Boost Your Value",
        message: "Small lifestyle changes can significantly increase your sperm value. Check out our tips!",
        type: "info",
        action_url: "/content"
      });
    }

    // Sleep quality notification
    if (todayLog?.sleep_hours && todayLog.sleep_hours < 6) {
      notifications.push({
        user_id,
        title: "😴 Sleep Matters",
        message: "You logged less than 6 hours of sleep. Quality rest is crucial for sperm health.",
        type: "warning",
        action_url: "/content"
      });
    }

    // Exercise reminder
    if (todayLog?.exercise_minutes === 0 || !todayLog?.exercise_minutes) {
      notifications.push({
        user_id,
        title: "🏃 Stay Active",
        message: "No exercise logged today. Even 30 minutes can make a difference!",
        type: "info",
        action_url: "/content"
      });
    }

    // Insert notifications
    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      console.log(`Generated ${notifications.length} notifications for user ${user_id}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: notifications.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-notifications error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
