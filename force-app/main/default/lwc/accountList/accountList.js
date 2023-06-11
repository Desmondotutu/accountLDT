import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

export default class AccountList extends NavigationMixin(LightningElement) {
    accounts;
    columns = columns;
    wiredAccountsResult;

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accounts = result.data;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'edit':
                this.editAccount(row.Id);
                break;
            case 'delete':
                this.deleteAccount(row.Id);
                break;
            default:
        }
    }

    editAccount(accountId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: accountId,
                objectApiName: 'Account',
                actionName: 'edit',
            },
        });
    }

    deleteAccount(accountId) {
        deleteAccount({ accountId: accountId })
            .then(() => {
                return refreshApex(this.wiredAccountsResult);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleNewAccount() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new',
            },
        });
    }
}