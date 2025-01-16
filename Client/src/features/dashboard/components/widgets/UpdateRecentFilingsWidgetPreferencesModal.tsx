import Modal from "@common/components/Modal.tsx";
import Button from "@common/components/Button.tsx";
import React, {useEffect, useState} from "react";
import { RecentFilingsWidgetPreference } from "@/features/user/types";

interface UpdateRecentFilingsWidgetPreferencesModalProps {
    isOpen: boolean;
    currentPreference: RecentFilingsWidgetPreference;
    onCancel: () => void;
    onSubmit(newPreference: RecentFilingsWidgetPreference): void;
}

function UpdateRecentFilingsWidgetPreferencesModal (props: UpdateRecentFilingsWidgetPreferencesModalProps){
    const {
        isOpen,
        onCancel,
        onSubmit,
        currentPreference
    } = props;

    const selectOptions = [3, 5, 7, 10];

    const [preference, setPreference] = useState<RecentFilingsWidgetPreference>(
        {
            numFilingsToShow: 5,
            showTicker: true,
            showFilingType: true,
        }
    );

    useEffect(() => {
        if (currentPreference) {
            setPreference({...currentPreference});
        }
    }, [currentPreference]);

    console.log(preference);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title="Recent Filings Preferences"
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Number of filings to show
                    </label>
                    <select
                        className="w-full rounded-lg bg-surface-foreground border-border p-2"
                        value={preference.numFilingsToShow}
                        onChange={(e) => {
                            const newPref = {
                                ...preference,
                                numFilingsToShow: Number(e.target.value)
                            };
                            setPreference(newPref);
                        }}
                    >
                        {selectOptions.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={preference.showTicker}
                            onChange={(e) => {
                                const newPref = {
                                    ...preference,
                                    showTicker: e.target.checked
                                };
                                setPreference(newPref);
                            }}
                            className="rounded border-border bg-surface-foreground"
                        />
                        <span className="text-sm text-foreground">Show company ticker</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={preference.showFilingType}
                            onChange={(e) => {
                                const newPref = {
                                    ...preference,
                                    showFilingType: e.target.checked
                                };
                                setPreference(newPref);
                            }}
                            className="rounded border-border bg-surface-foreground"
                        />
                        <span className="text-sm text-foreground">Show filing type</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="foreground"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onSubmit(preference)}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default UpdateRecentFilingsWidgetPreferencesModal;