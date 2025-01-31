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
import {renderAlertTypeFields} from "@features/alerts/components/utils.tsx";

interface AlertRuleDialogProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (data: AlertRuleFormData) => void;
}


function CreateAlertRuleDialog(props: AlertRuleDialogProps) {
    const { open, onCancel, onSubmit } = props;
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
    });

    return (
        <Dialog open={open}>
            <DialogContent className="bg-surface text-foreground border-border" onClose={onCancel}>
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
                                        value={field.value || ''}
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
                        {renderAlertTypeFields(selectedType, control, errors)}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={onCancel}
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

export default CreateAlertRuleDialog;