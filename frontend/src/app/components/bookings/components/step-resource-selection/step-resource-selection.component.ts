import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Resource, ResourceService } from 'src/app/components/resources/services/resource.service';
import { ResourceType } from 'src/app/components/resourcetypes/services/resource-type.service';


@Component({
    selector: 'app-step-resource-selection',
    templateUrl: './step-resource-selection.component.html',
    styleUrls: ['./step-resource-selection.component.scss']
})
export class StepResourceSelectionComponent implements OnInit {

    // Array para guardar los recursos que vienen de la API
    resources: Resource[] = [];
    selectedResourceId: string | null = null;

    // El 'EventEmitter' es la herramienta para que este componente "hable" con su padre (BookingWizardComponent)
    @Output() resourceSelected = new EventEmitter<Resource>();

    constructor(private resourceService: ResourceService) { }

    ngOnInit(): void {
        // Al iniciar, llamamos al endpoint "inteligente" que nos devuelve solo los recursos
        // que el usuario actual tiene permiso para reservar.
        this.resourceService.getBookableResources().subscribe({
            next: (data) => {
                this.resources = data;
            },
            error: (err) => {
                console.error('Error al cargar los recursos disponibles:', err);
                // Aquí podríamos mostrar un mensaje de error si fuera necesario
            }
        });
    }

    /**
     * Este método se ejecuta cuando el usuario hace clic en el botón "Seleccionar" de una tarjeta.
     * @param resource El objeto completo del recurso que fue seleccionado.
     */
    selectResource(resource: Resource): void {
        // Guardamos el ID del recurso seleccionado en nuestra nueva propiedad
        this.selectedResourceId = resource._id;
        // Emitimos el evento 'resourceSelected' y le pasamos el recurso elegido como dato.
        // El componente padre estará escuchando este evento.
        this.resourceSelected.emit(resource);
    }

    getResourceTypeName(resource: Resource): string {
        // Verificamos si la propiedad 'type' es un objeto y no es nula
        if (resource.type && typeof resource.type === 'object') {
            // Si es un objeto, devolvemos su propiedad 'name'
            return (resource.type as ResourceType).name;
        }
        // Si no es un objeto (o es nulo), devolvemos un string vacío.
        return '';
    }
}
