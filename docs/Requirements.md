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
| ADMIN003 | The administrator can login with the  Google API. This is done through a hidden login page | MUST
| ADMIN004| The administrator should be able to download the results in CSV format. So its openable in Excel | WOULD |
| ADMIN005 | The administrator should be able to see a visual representation inside, E.G graphs of per project and per team, Approval over time.  | WOULD |
| ADMIN006 | The administrator should be warned when a partner is not satisfied. This is done using a visual notifier and a push message in the browser | WOULD |
| ADMIN007 | The administrator should be able to put a time limit on how long the link can be active | SHOULD |
| ADMIN008 | The administrator should be able to close and reopen the link manually | SHOULD |
| ADMIN009 | The administrator should be able to add individual team members to a project, so he can knows which team member was in the project so he can monitor customer satisfaction for each project | MUST | 
| ADMIN010 | The administrator could add more projects to a partner. | MUST |

### Partner
| NR | about | Priority |
| --- | --- | --- | 
| PARTNER001 | The Partner should have a special URL to fill in their forms | MUST
| PARTNER002 | The partner receives a mail when the URL is available for filling in | SHOULD
| PARTNER003 | The partner should not fill in a password or credentials. Thus the Link must be long enough and unique |  MUST | 
| PARTNER004 | When the partner has finished the questionaire, the link should be no longer usable | WOULD |
| PARTNER005 | The partner can download their answers in a computer readable format (E.G txt/JSON/XML) | WOULD | 
|

## NON-Functional Requirements
### Backend
| NR | about | Priority |
| --- | --- | --- | 
| BACK_001 | The backend should be written in scala and the play framework | MUST |
| BACK_002 | Automatic [linting software](https://scalacenter.github.io/scalafix/) should be enabled for the backend | SHOULD | 
| BACK_003 | The backend must be a RESTFULL API* | MUST |
| BACK_004 | The backend should have a GraphQL API | SHOULD | 
| BACK_005 | The backend must communicate with a (Persistent) database such as Postgresql/MySQL/MariaDB | MUST | 

\* Since Scala play is already new I start with a Restfull API


### Deployment
| NR | about | Priority |
| --- | --- | --- | 
| DEPL_005 | The backend/front-end/database must be deployed with Docker and Docker Compose | MUST |
| DEPL_006 | The backend/front-end/database must be automaticly build with a CI tool such as Travis/Jenkins | WOULD |

### Front-end
| NR | about | Priority |
| --- | --- | --- |
| FRONT_001 | The front end must be made with Angular | MUST | 
| FRONT_002 | The front end must be served using Nginx or Apache | SHOULD |
| FRONT_003 | The front end is written in Scss | WOULD |


