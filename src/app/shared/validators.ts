import { FormControl, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { getControlName } from './get-control-name';
import { IRateAndException } from '../model/rate-and-exception.model';

export function dateLessThanDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        var date1 = control.get('effectiveStartDate').value;
        var date2 = control.get('effectiveEndDate').value;
        var newDate1 = new Date(date1);
        var newDate2 = new Date(date2);

        return (newDate1 <= newDate2 || date1 == null || date1 == "" || date2 == null || date2 == "") ? null : {
            dateLessThanDate: {
                effectiveStartDate: date1,
                effectiveEndDate: date2
            }
        }
    }
}

export function rateNotExisting(ppaBonusRates: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        var sale = control.parent.controls['salesTerritory'].value;
        var util = control.parent.controls['utilityCompany'].value;
        var fin = control.parent.controls['financePartner'].value;
        var pur = control.parent.controls['purchaseMethod'].value;
        var effectiveStartDate = control.parent.controls['effectiveStartDate'].value;

        var valid = true;

        Object.keys(control.parent.controls).forEach(x => {
            if (getControlName(control) == x) return;
            if (control.value == control.parent.controls[x].value) valid = false;
        });

        ppaBonusRates.filter(x => x.salesTerritoryId === sale && x.utilityCompanyId === util && x.financePartnerId === fin && x.purchaseMethodId === pur && x.effectiveStartDate == `${effectiveStartDate}T00:00:00`).forEach(x => {
            if (x.ppaRate == control.value) valid = false;
        })

        return (valid) ? null : {
            rateNotExisting: {
                valid: false
            }
        }
    }
}

export function maxTerritoryRateDate(territoryRates: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        territoryRates.filter(x => x.salesTerritoryId === control.get('salesTerritory').value && x.utilityCompanyId === control.get('utilityCompany').value && x.financePartnerId === control.get('financePartner').value && x.purchaseMethodId === control.get('purchaseMethod').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxFinancePartnerDeductionDate(financePartnerDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        financePartnerDeductions.filter(x => x.financePartnerId === control.get('financePartner').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxModuleDeductionDate(moduleDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        moduleDeductions.filter(x => x.salesTerritoryId === control.get('salesTerritory').value && x.moduleTypeId === control.get('moduleType').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxInverterDeductionDate(inverterDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        inverterDeductions.filter(x => x.financePartnerId === control.get('financePartner').value && x.inverterTypeId === control.get('inverterType').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxInstallationTypeDeductionDate(installationTypeDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        installationTypeDeductions.filter(x => x.installationTypeId === control.get('installationType').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxPurchaseMethodDeductionDate(purchaseMethodDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        purchaseMethodDeductions.filter(x => x.purchaseMethodId === control.get('purchaseMethod').value && x.salesTerritoryId === control.get('salesTerritory').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxPermitDeductionDate(permitDeductions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;

        var dates = [];
        permitDeductions.filter(x => x.purchaseMethodId === control.get('purchaseMethod').value && x.salesTerritoryId === control.get('salesTerritory').value && x.financePartnerId === control.get('financePartner').value).forEach(tr => {
            dates.push(new Date(tr.effectiveStartDate));
        });

        if (dates.length == 0) return null;

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function maxRateAndExceptionDate(rateAndExceptions: IRateAndException[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.get('effectiveStartDate').value == "") return null;
        if (rateAndExceptions.length == 0) return null;

        var dates = [];
        rateAndExceptions.filter(x => x.contactRateAndExceptionTypeId == control.get('contactRateAndExceptionTypeId').value).forEach(tr => {
            // dates.push(new Date(tr.effectiveStartDate));
            if (tr.effectiveEndDate != null) dates.push(new Date(tr.effectiveEndDate));
        });

        if (dates.length == 0) {
            rateAndExceptions.filter(x => x.contactRateAndExceptionTypeId == control.get('contactRateAndExceptionTypeId').value).forEach(tr => {
                // dates.push(new Date(tr.effectiveStartDate));
                if (tr.effectiveStartDate != null) dates.push(new Date(tr.effectiveStartDate));
            });
        }

        var maxDate = dates[0],
            maxDateObj = new Date(dates[0]);
        dates.forEach(dt => {
            if (new Date(dt) > maxDateObj) {
                maxDate = dt;
                maxDateObj = new Date(dt);
            }
        });

        if (!maxDate) {
            maxDate = new Date(1900,1,1);
        }

        // if (maxDate)
        //     maxDate.setDate(maxDate.getDate() + 1);
            
        return ((control.get('effectiveStartDate').value != null && new Date(control.get('effectiveStartDate').value) > maxDate)) ? null : {
            maxDate: {
                valid: false
            }
        }
    }
}

export function baseFormulaFirstCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value.match('^@')) {
            return null
        } else {
            return {
                firstChar: {
                    valid: false
                }
            }
        }
    }
}