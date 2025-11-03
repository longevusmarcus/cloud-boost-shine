import { supabase } from '@/integrations/supabase/client';

interface AuditLogParams {
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT';
  tableName: string;
  recordId?: string;
  details?: unknown;
}

/**
 * Hook for HIPAA-compliant audit logging
 * Tracks all PHI access and modifications
 */
export function useAuditLog() {
  const logAction = async ({ action, tableName, recordId, details }: AuditLogParams) => {
    try {
      const newData = typeof details === 'string' ? { message: details } : (details ?? null);
      await supabase.rpc('log_audit', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId || null,
        p_old_data: null,
        p_new_data: newData as any,
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  };

  return { logAction };
}
