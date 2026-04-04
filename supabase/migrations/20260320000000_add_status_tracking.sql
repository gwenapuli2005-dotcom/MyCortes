-- Create request_status_history table
CREATE TABLE IF NOT EXISTS request_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID,
  notes TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system_notifications table
CREATE TABLE IF NOT EXISTS system_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'request_update', -- 'request_update', 'approval', 'rejection', 'completion'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_request_status_history_request_id ON request_status_history(request_id);
CREATE INDEX IF NOT EXISTS idx_request_status_history_changed_at ON request_status_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_is_read ON system_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_system_notifications_request_id ON system_notifications(request_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created_at ON system_notifications(created_at);

-- Add status history triggers for service_requests
CREATE OR REPLACE FUNCTION track_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO request_status_history (request_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
    
    -- Auto-create notification for status updates
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO system_notifications (user_id, request_id, title, message, type)
      VALUES (
        NEW.user_id,
        NEW.id,
        'Request Status Updated',
        'Your request status has been changed to ' || NEW.status || '.',
        CASE 
          WHEN NEW.status = 'completed' THEN 'completion'
          WHEN NEW.status = 'rejected' THEN 'rejection'
          WHEN NEW.status = 'in_progress' THEN 'request_update'
          ELSE 'request_update'
        END
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS request_status_change_trigger ON service_requests;
CREATE TRIGGER request_status_change_trigger
AFTER UPDATE ON service_requests
FOR EACH ROW
EXECUTE FUNCTION track_request_status_change();
