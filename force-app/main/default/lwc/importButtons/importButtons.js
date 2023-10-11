import { LightningElement, wire } from 'lwc';
import GetS3CSVFileData from '@salesforce/apex/AmazonS3Controller.GetS3CSVFileData';
import { publish, MessageContext } from 'lightning/messageService';
import PAGE_REFRESH_MESSAGE_CHANNEL from '@salesforce/messageChannel/PageRefreshMessageChannel__c';

export default class ImportButtons extends LightningElement {

    @wire(MessageContext)
    messageContext;


    importAccountsHandler() {
        console.log('Inside import Account Handler');
        GetS3CSVFileData({ fileName: 'Accounts.csv', SObjectName: 'Account' })
            .then(res => {
                console.log(res);
                // TODO: Dispatch Platform event
                const message = {
                    messageToSend: 'Refresh The page',
                    sourceSystem: 'From Account Imported'
                }
                publish(this.messageContext, PAGE_REFRESH_MESSAGE_CHANNEL, message);
                console.log('Message published');
            })
            .catch(error => {
                console.log(error);
            })
    }

    importContactsHandler() {
        console.log('Inside import Contact Handler');
        GetS3CSVFileData({ fileName: 'Contacts.csv', SObjectName: 'Contact' })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }
}