import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LEAD_OBJECT = 'Lead';

export default class LeadList extends LightningElement {
    searchKey = '';
    filter = '';
    leads = [];
    columns = [
        { label: 'First Name', fieldName: 'FirstName', editable: true },
        { label: 'Last Name', fieldName: 'LastName', editable: true },
        { label: 'Company', fieldName: 'Company', editable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
        { label: 'Email', fieldName: 'Email', type: 'email', editable: true }
    ];
    rowActions = [
        { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
    ];

    @wire(getListUi, {
        objectApiName: LEAD_OBJECT,
        listViewApiName: 'All_Leads'
    })
    wiredLeads({ data, error }) {
        if (data) {
            this.leads = data.records.records;
        } else if (error) {
            console.error(error);
        }
    }

    handleSave(event) {
        const fields = event.detail.fields;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead updated',
                        variant: 'success'
                    })
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'edit':
                this.editLead(row);
                break;
            case 'delete':
                this.deleteLead(row);
                break;
            default:
                break;
        }
    }

    editLead(row) {
        const editEvent = new CustomEvent('editlead', {
            detail: {
                leadId: row.Id
            }
        });
        this.dispatchEvent(editEvent);
    }

    deleteLead(row) {
        // Implement delete logic here
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value.toLowerCase();
    }

    handleFilterChange(event) {
        this.filter = event.target.value;
    }

    get filteredLeads() {
        return this.leads.filter((lead) => {
            return (
                lead.FirstName.toLowerCase().includes(this.searchKey) ||
                lead.LastName.toLowerCase().includes(this.searchKey) ||
                lead.Company.toLowerCase().includes(this.searchKey)
            );
        });
    }

    get filteredAndSortedLeads() {
        let filteredLeads = this.filteredLeads;

        if (this.filter === 'company') {
            filteredLeads.sort((a, b) =>
                a.Company.localeCompare(b.Company)
            );
        } else if (this.filter === 'last_name') {
            filteredLeads.sort((a, b) =>
                a.LastName.localeCompare(b.LastName)
            );
        } else {
            filteredLeads.sort((a, b) =>
                a.FirstName.localeCompare(b.FirstName)
            );
        }

        return filteredLeads;
    }
}