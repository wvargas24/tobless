import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Resource, ResourceService } from '../../services/resource.service';
import { ResourceType, ResourceTypeService } from 'src/app/components/resourcetypes/services/resource-type.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-admin-resource',
    templateUrl: './admin-resource.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AdminResourceComponent implements OnInit {

    resources: Resource[] = [];
    resourceDialog: boolean = false;
    submitted: boolean = false;
    resource: Partial<Resource> = {};

    // Opciones para el dropdown del tipo de recurso
    resourceTypes: SelectItem[] = [];

    constructor(
        private resourceService: ResourceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private resourceTypeService: ResourceTypeService
    ) { }

    ngOnInit(): void {
        this.loadResources();
        this.loadResourceTypes();
    }

    loadResources(): void {
        this.resourceService.getResources().subscribe(data => this.resources = data);
    }

    loadResourceTypes(): void {
        // Ya no es una lista quemada, ¡ahora viene de la API!
        this.resourceTypeService.getResourceTypes().subscribe(types => {
            this.resourceTypes = types.map(type => ({
                label: type.name, // Usamos el nombre del tipo
                value: type._id  // Usamos su ID como valor
            }));
        });
    }

    openNew(): void {
        this.resource = { isActive: true }; // Por defecto, activo
        this.submitted = false;
        this.resourceDialog = true;
    }

    editResource(resource: Resource): void {
        this.resource = { ...resource };
        if (this.resource.type && typeof this.resource.type === 'object') {
            this.resource.type = (this.resource.type as ResourceType)._id;
        }
        this.resourceDialog = true;
    }

    deleteResource(resource: Resource): void {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + resource.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.resourceService.deleteResource(resource._id).subscribe(() => {
                    this.resources = this.resources.filter(val => val._id !== resource._id);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Recurso Eliminado' });
                });
            }
        });
    }

    hideDialog(): void {
        this.resourceDialog = false;
        this.submitted = false;
    }

    saveResource(): void {
        this.submitted = true;
        if (!this.resource.name?.trim() || !this.resource.type) {
            return;
        }

        const process = this.resource._id
            ? this.resourceService.updateResource(this.resource._id, this.resource)
            : this.resourceService.createResource(this.resource as Resource);

        process.subscribe(() => {
            const detail = this.resource._id ? 'Recurso Actualizado' : 'Recurso Creado';
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail });
            this.loadResources();
        });

        this.resourceDialog = false;
        this.resource = {};
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
