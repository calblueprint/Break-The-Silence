// Supabase Edge Function: support-relay-send
// Authenticated outbound SMS via a per-user Twilio relay number (POC).

import { createClient } from 'npm:@supabase/supabase-js@2';
import { loadRelayMap } from '../_shared/relay-map.ts';
import { sendSms } from '../_shared/twilio.ts';
import { handleRequest } from './handler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

Deno.serve(req =>
  handleRequest(req, {
    authenticate: async token => {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data, error } = await client.auth.getUser(token);
      if (error || !data.user) return null;
      return { id: data.user.id };
    },
    relayMap: loadRelayMap(Deno.env),
    send: params => sendSms(params),
  }),
);
