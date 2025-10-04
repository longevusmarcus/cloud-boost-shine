import { supabase } from '@/integrations/supabase/client';

interface AuditLogParams {
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT';
  tableName: string;
  recordId?: string;
  details?: string;
}

/**
 * Hook for HIPAA-compliant audit logging
 * Tracks all PHI access and modifications
 */
export function useAuditLog() {
  const logAction = async ({ action, tableName, recordId, details }: AuditLogParams) => {
    try {
      // Call the database function to log the audit
      await supabase.rpc('log_audit', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId || null,
        p_old_data: null,
        p_new_data: details ? JSON.parse(details) : null,
      });
    } catch (error) {
      // Log errors but don't block the main operation
      console.error('Audit log failed:', error);
    }
  };

  return { logAction };
}
