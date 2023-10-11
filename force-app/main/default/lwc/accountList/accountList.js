import { LightningElement, api, track, wire } from 'lwc';
import getAccountsList from '@salesforce/apex/CustomAccountController.getAccountsList';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import EXTSYSACCID_FIELD from '@salesforce/schema/Account.ExtSysAccId__c';
import { refreshApex } from '@salesforce/apex';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import PAGE_REFRESH_MESSAGE_CHANNEL from '@salesforce/messageChannel/PageRefreshMessageChannel__c';

const COLUMNS = [
    { fieldName: ID_FIELD.fieldApiName, label: 'Id' },
    { fieldName: NAME_FIELD.fieldApiName, label: 'Name' },
    { fieldName: INDUSTRY_FIELD.fieldApiName, label: 'Industry' },
    { fieldName: EXTSYSACCID_FIELD.fieldApiName, label: 'ExtSysAccId' }
];

export default class AccountList extends LightningElement {
    columns = COLUMNS;
    @api records = [];
    @api error = null;
    @api accId;

    // TODO: Subscribe platform event and again call the apex method once data is imported successfully
    @wire(MessageContext)
    messageContext;
    subscription = null;

    connectedCallback() { 
        this.pageRefreshHandler();
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, PAGE_REFRESH_MESSAGE_CHANNEL, (message) => this.pageRefreshHandler());
       
    }

    // @wire(getAccountsList, { rowLimit: 10 })
    // wiredAccount({ error, data }) {
    //     if (data) {
    //         this.records = data;
    //         this.error = null;
    //     } else if (error) {
    //         this.error = error;
    //         this.records = null;
    //     }
    // }

    onRowSelectionHandler(event) {
        const selectAccId = event.detail.selectedRows[0];
        console.log(event);
        this.accId = selectAccId.Id;
        console.log(this.accId);
    }

    pageRefreshHandler() {
        console.log('hello');
      
        getAccountsList({ rowLimit: 10 }).then((res) => {
            console.log(res);
            this.records = res;
            this.error = null;
            console.log(this.records);
        }).catch((error) => {
            this.error=error;
            this.records = null;
        })
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

}