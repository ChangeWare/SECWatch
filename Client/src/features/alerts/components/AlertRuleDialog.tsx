import {Controller, useForm} from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@common/components/Dialog.tsx";
import CompanySearchInput from "@features/companySearch/components/CompanySearchInput.tsx";
import {cn} from "@common/lib/utils.ts";
import Button from "@common/components/Button.tsx";
import {useState} from "react";
import AlertTypeSelector from "@features/alerts/components/AlertTypeSelector.tsx";
import {AlertRuleFormData, AlertRuleTypes, FILING_TYPES} from "../types.ts";

interface AlertRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AlertRuleFormData) => void;
}


function AlertRuleDialog(props: AlertRuleDialogProps) {
    const { open, onOpenChange, onSubmit } = props;
    const [selectedType, setSelectedType] = useState<string>(AlertRuleTypes.Filing);

    const { control, handleSubmit, watch, formState: { errors } } = useForm<AlertRuleFormData>({
        defaultValues: {
            type: AlertRuleTypes.Filing,
            name: '',
            description: '',
            data: { formTypes: [] }
        }
    });

    const selectedCompany = watch('company');
    const selectedFilingTypes = watch('data.formTypes');

    const onFormSubmit = handleSubmit((data) => {
        onSubmit(data);
        onOpenChange(false);
    });

    // Render form fields based on alert type
    const renderAlertTypeFields = () => {
        switch (selectedType) {
            case AlertRuleTypes.Filing:
                return (
                    <Controller
                        name="data.formTypes"
                        control={control}
                        rules={{ required: 'Select at least one filing type' }}
                        render={({ field }) => (
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
                        )}
                    />
                );
            // Add cases for other alert types here
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-surface text-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Create Alert Rule</DialogTitle>
                    <DialogDescription className="text-secondary">
                        Set up an alert rule
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onFormSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: 'Alert type is required' }}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Alert Type</label>
                                    <AlertTypeSelector
                                        value={field.value}
                                        onChange={(type) => {
                                            field.onChange(type);
                                            setSelectedType(type);
                                        }}
                                    />
                                    {errors.type && (
                                        <p className="text-error text-sm mt-1">{errors.type.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        {...field}
                                        className="w-full px-3 py-2 bg-surface-foreground rounded-lg border border-border"
                                        placeholder="Alert rule name"
                                    />
                                    {errors.name && (
                                        <p className="text-error text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        {...field}
                                        className="w-full px-3 py-2 bg-surface-foreground rounded-lg border border-border"
                                        placeholder="Optional description"
                                        rows={3}
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="company"
                            control={control}
                            rules={{ required: 'Company is required' }}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company</label>
                                    <CompanySearchInput
                                        onSelect={field.onChange}
                                        selectedCompany={field.value}
                                    />
                                    {errors.company && (
                                        <p className="text-error text-sm mt-1">{errors.company.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        {renderAlertTypeFields()}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!selectedCompany || !selectedFilingTypes?.length}
                        >
                            Create Alert
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AlertRuleDialog;