import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { FormFieldConfig } from './serviceCategories';

interface DynamicFormFieldsProps {
  fields: FormFieldConfig[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export const DynamicFormFields = ({ fields, values, errors, onChange }: DynamicFormFieldsProps) => {
  // Group fields into rows: two halfWidth fields share a row
  const rows: FormFieldConfig[][] = [];
  let i = 0;
  while (i < fields.length) {
    if (fields[i].halfWidth && i + 1 < fields.length && fields[i + 1].halfWidth) {
      rows.push([fields[i], fields[i + 1]]);
      i += 2;
    } else {
      rows.push([fields[i]]);
      i++;
    }
  }

  return (
    <>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={row.length > 1 ? 'grid grid-cols-2 gap-3' : ''}>
          {row.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm font-medium">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </label>

              {field.type === 'select' ? (
                <Select
                  value={values[field.name] || ''}
                  onValueChange={(v) => onChange(field.name, v)}
                >
                  <SelectTrigger className={errors[field.name] ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pumili / Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  maxLength={field.maxLength || 500}
                  className={errors[field.name] ? 'border-destructive' : ''}
                />
              ) : (
                <Input
                  type={field.type}
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={errors[field.name] ? 'border-destructive' : ''}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
