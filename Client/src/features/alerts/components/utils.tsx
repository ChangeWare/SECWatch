// Render form fields based on alert type
import {Control, Controller} from "react-hook-form";
import {AlertRuleFormData, AlertRuleTypes, FILING_TYPES} from "@features/alerts/types.ts";
import {cn} from "@common/lib/utils.ts";

export function renderAlertTypeFields (selectedType: string, control:  Control<AlertRuleFormData, any>, errors: any) {
    switch (selectedType) {
        case AlertRuleTypes.Filing:
            return (
                <Controller
                    name="data.formTypes"
                    control={control}
                    rules={{ required: 'Select at least one filing type' }}
                    render={({ field }) => {
                        return (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Filing Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {FILING_TYPES.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                const currentTypes = field.value || [];
                                                const newTypes = currentTypes.includes(type)
                                                    ? currentTypes.filter((t: string) => t !== type)
                                                    : [...currentTypes, type];
                                                field.onChange(newTypes);
                                            }}
                                            className={cn(
                                                'px-3 py-1.5 rounded-lg transition-colors',
                                                (field.value || []).includes(type)
                                                    ? 'bg-success text-success-foreground'
                                                    : 'bg-surface-foreground text-secondary hover:bg-surface-foreground/80'
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.data?.formTypes?.message && (
                                    <p className="text-error text-sm mt-1">{errors.data.formTypes.message.toString()}</p>
                                )}
                            </div>
                        )
                    }}
                />
            );
        // Add cases for other alert types here
        default:
            return null;
    }
};