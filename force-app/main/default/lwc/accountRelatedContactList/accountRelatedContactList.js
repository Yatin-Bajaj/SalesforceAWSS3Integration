import { LightningElement, api, wire } from 'lwc';
import getContactListByAccId from '@salesforce/apex/CustomAccountController.getContactListByAccId';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import EXTSYSCONTACTID_FIELD from '@salesforce/schema/Contact.ExtSysContactId__c';

const COLUMNS = [
    {label:'Id', fieldName:ID_FIELD.fieldApiName},
    {label:'LastName', fieldName:LASTNAME_FIELD.fieldApiName},
    {label:'FirstName', fieldName:FIRSTNAME_FIELD.fieldApiName},
    {label:'ExtSysContactId', fieldName:EXTSYSCONTACTID_FIELD.fieldApiName}
]

export default class AccountRelatedContactList extends LightningElement {
    columns = COLUMNS;
    @api records = [];
    @api error = undefined;
    @api accId;

    @wire(getContactListByAccId,{accId:'$accId'})
    wiredContacts({error,data}){
        if(data){
            this.records = data;
            this.error = undefined;
            console.log(this.records);
        }else if(error){
            this.error = error;
            this.records = undefined;
        }
    }

}