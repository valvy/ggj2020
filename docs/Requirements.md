# Requirements
## Users of the system
| Name | about |
| --- | --- | 
| Administrator | The person maintaining the application, he should be able to invite partners and have a global overview of the answers that partners give. This should be achievable without access of the source code. |
| Partner |  A partner that is invited by the administrator to fill in his experience. He receives a link and can fill this in.
## Functional Requirements
### Administrator
| NR | about | Priority |
| --- | --- | --- | 
| ADMIN001 | The administrator can open for a partner a special page that contains certain multiple choice questions, rating questions and open questions. The fields of this page can be hardcoded | MUST
| ADMIN002 | The administrator can have a global overview of all the results that are filled in by the partners in text. Such as tables and the mean | SHOULD
| ADMIN003 | The administrator can login with the github OAuth API. This is done through a hidden login page | MUST
| ADMIN004| The administrator should be able to download the results in CSV format. So its openable in Excel | WOULD |
| ADMIN005 | The administrator should be able to see a visual representation inside, E.G graphs of per project and per team, Approval over time.  | WOULD |
| ADMIN006 | The administrator should be warned when a partner is not satisfied. This is done using a visual notifier and a push message in the browser | WOULD |
| ADMIN007 | The administrator should be able to put a time limit on how long the link can be active | SHOULD |
| ADMIN008 | The administrator should be able to close and reopen the link manually | SHOULD |

### Partner
| NR | about | Priority |
| --- | --- | --- | 
| PARTNER001 | The Partner should receive a URL per mail. This will direct the partner to a special page containing the questions | MUST | 
| PARTNER002 | The partner should not fill in a password or credentials. Thus the Link must be long enough and unique |  MUST | 
| PARTNER003 | When the partner has finished the questionaire, the link should be no longer usable | WOULD |
| PARTNER004 | The partner can download their answers in a computer readable format (E.G txt/JSON/XML) | WOULD | 

# NON-Functional Requirements
