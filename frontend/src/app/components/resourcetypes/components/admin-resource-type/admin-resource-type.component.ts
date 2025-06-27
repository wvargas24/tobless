import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResourceType, ResourceTypeService } from '../../services/resource-type.service';

@Component({
    selector: 'app-admin-resource-type',
    templateUrl: './admin-resource-type.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AdminResourceTypeComponent implements OnInit {

    resourceTypes: ResourceType[] = [];
    resourceTypeDialog: boolean = false;
    submitted: boolean = false;
    resourceType: Partial<ResourceType> = {}; // Usamos Partial para manejar la creación (sin _id)

    constructor(
        private resourceTypeService: ResourceTypeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadResourceTypes();
    }

    loadResourceTypes(): void {
        this.resourceTypeService.getResourceTypes().subscribe(data => {
            this.resourceTypes = data;
        });
    }

    openNew(): void {
        this.resourceType = {};
        this.submitted = false;
        this.resourceTypeDialog = true;
    }

    editResourceType(resourceType: ResourceType): void {
        this.resourceType = { ...resourceType };
        this.resourceTypeDialog = true;
    }

    deleteResourceType(resourceType: ResourceType): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que quieres eliminar el tipo "${resourceType.name}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.resourceTypeService.deleteResourceType(resourceType._id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de Recurso Eliminado' });
                    this.loadResourceTypes(); // Recargamos la lista desde el servidor
                }, (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo eliminar' });
                });
            }
        });
    }

    hideDialog(): void {
        this.resourceTypeDialog = false;
        this.submitted = false;
    }

    saveResourceType(): void {
        this.submitted = true;

        if (!this.resourceType.name?.trim()) {
            return;
        }

        const process = this.resourceType._id
            ? this.resourceTypeService.updateResourceType(this.resourceType._id, this.resourceType)
            : this.resourceTypeService.createResourceType(this.resourceType as ResourceType);

        process.subscribe({
            next: () => {
                const detail = this.resourceType._id ? 'Tipo de Recurso Actualizado' : 'Tipo de Recurso Creado';
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail });
                this.loadResourceTypes();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Ocurrió un error' });
            }
        });

        this.resourceTypeDialog = false;
        this.resourceType = {};
    }
}
